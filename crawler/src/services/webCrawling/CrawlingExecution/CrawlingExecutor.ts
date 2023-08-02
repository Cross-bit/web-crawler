import {
	ExecutionDataWithRecord,
	IDatabaseWrapper,
} from "../../../database/interface";
import ExecutionsRecord from "./executionRecord";
import IExecutionsScheduler, {
	ICrawlersPool,
	IExecutionQueuesManager,
} from "../interface";
import { executionState } from "../../../utils/enums";
import workerpool, { WorkerPool } from "workerpool";
import { Sema } from "async-sema";
import { Worker } from "worker_threads";
import path from "path";
import EventEmitter from "events";

export default class CrawlingExecutor {
	workerSemaphore: Sema;
	execute: boolean;
	crawlerPool: ICrawlersPool;
	executinoQueueManager: IExecutionQueuesManager;
	executionPeriod: number;
	pool: WorkerPool;
	database: IDatabaseWrapper;
	bannedExecutions: Set<number>;
	executingWorkers: Map<number, Worker>;

	public ExecutionState = new EventEmitter();

	constructor(
		crawlerPool: ICrawlersPool,
		executionQManager: IExecutionQueuesManager,
		database: IDatabaseWrapper
	) {
		this.execute = true;
		this.crawlerPool = crawlerPool;
		this.executinoQueueManager = executionQManager;
		this.executionPeriod = 1000; // check every second TODO: 
		this.database = database;
		this.bannedExecutions = new Set();
		this.executingWorkers = new Map();

		this.workerSemaphore = new Sema(
			+(process.env.CRAWLER_INI_INSTANCES || 0)
		);
		const crawlerPath = path.join(
			__dirname,
			"CrawlingWorker/crawlingWorker2.ts"
		);
		this.pool = workerpool.pool(crawlerPath);
	}

	async Execute() {
		// Main execution loop witch periodicall checking
		setInterval(async () => {
			await this.workerSemaphore.acquire();
			const executionToProcess =
				this.executinoQueueManager.TryToGetNextItem();
			if (executionToProcess) { // TODO: first look if we have any execution to process before acquiring the lock, otherwise return immediatelly
				console.log(`exe loop: rec. id(${executionToProcess?.recordID}); exe. id(${executionToProcess?.executionID})`);
			}

			// check if job wasnt cancled

			if (executionToProcess?.executionID && this.bannedExecutions.has(executionToProcess.executionID)) {
				this.bannedExecutions.delete(executionToProcess?.executionID);
				this.workerSemaphore.release();
				return;
			}
			


			if (executionToProcess) {
				const updatedExecutionData =
					await this.TryToUpdateExecutionDatabase(executionToProcess);

				if (!updatedExecutionData) {
					this.workerSemaphore.release();
					return;
				}

				const crawlerPath = path.join(
					__dirname,
					"ParallelCrawling/CrawlingWorker/CrawlingWorker.ts" //TODO: move out to constant!!
				);


				const crawlingWorker = new Worker(crawlerPath, {
					workerData: {
						exeData: { ...updatedExecutionData },
					},
				});

				this.executingWorkers.set(executionToProcess.executionID, crawlingWorker);

				crawlingWorker.on("message", async (event: any) => {

					const executionData = { ...executionToProcess };

					if (event.type && event.type == "done") {
						this.OnExecutionDone(executionData, event.crawlTime);
						this.executingWorkers.delete(executionData.executionID);
						crawlingWorker.terminate(); // kill the crawlingWorker TODO: use pool
						this.workerSemaphore.release();
					}
					// else TODO: hanlde error because we dont expect anything else...
				});
			} else {
				this.workerSemaphore.release();
			}
		}, this.executionPeriod);
	}

	public async ForceCancleExecutionById(executionID: number) {
		
		if (!this.executingWorkers.has(executionID)) 
			this.bannedExecutions.add(executionID); // we are not executing yet
		else {
			
			const worker = this.executingWorkers.get(executionID) as Worker; // we want to cancle execution
			worker.postMessage({ command: 'HALT' });
			//worker = ?.terminate()
			worker.terminate();
			this.workerSemaphore.release();
		}

	}

	private async OnExecutionDone(originalExeRec: ExecutionsRecord, crawlTime: number)
	{
		const exeFilter = {
			executionIDs: [originalExeRec.executionID as number],
		};

		const currentExecution = 
			((await this.database.ExecutionDatabase?.GetExecutionsWithRecord(
				exeFilter
			)) || [undefined])[0] as ExecutionDataWithRecord;
		
		if (!currentExecution) {
			// throw error
			Promise.resolve(false);
		}
			
		if (!currentExecution.record) {
			// if record does not longer exist but the execution record does => 
			// => inconsistent state inform user (to delete executions, etc.)...TODO:
			Promise.resolve(false);
		}

		await this.UpdateExecutionDatabaseOnExeDone(originalExeRec.executionID, crawlTime);

		if (currentExecution.isTimed)
			this.OnReplanTimedExecution(currentExecution);
	}

	/**
	 * Replans timed execution after execution is done.
	 * @param executionRecord - execution record to replan
	 */
	private async OnReplanTimedExecution(executionRecord: ExecutionDataWithRecord) {
		this.ExecutionState.emit('executionDone', executionRecord);
	}

	/**
	 * Updates state of execution record in database once the execution is done.
	 * @param executionID - id of the execution record, that finished its execution. 
	 */
	private async UpdateExecutionDatabaseOnExeDone
	(executionID: number, crawlTime: number): Promise<void>  {
		await this.database.ExecutionDatabase?.UpdateExecutionsState(
			executionState.DONE,
			{ executionIDs: [executionID] }
		);
		
		await this.database.ExecutionDatabase?.UpdateExecutionsDuration(
			crawlTime,
			{ executionIDs: [executionID] }
		);

		Promise.resolve(true);
	}

	/**
	 * Tries to update execution record in db from planned to RUNNING state.
	 * If there is a problem, it updates it as CAN
	 * @param originalExeRec
	 * @returns
	 */
	private async TryToUpdateExecutionDatabase(
		originalExeRec: ExecutionsRecord
	): Promise<ExecutionDataWithRecord | false> {
		const exeFilter = {
			executionIDs: [originalExeRec.executionID as number],
		};

		// TODO: fix dry
		const currentExecution =
			((await this.database.ExecutionDatabase?.GetExecutionsWithRecord(
				exeFilter
			)) || [undefined])[0] as ExecutionDataWithRecord;
		
			
		if (!currentExecution) {
			// throw error
			return Promise.resolve(false);
		}
			
		if (!currentExecution.record) {
			// if record does not longer exist but the execution record does => 
			// => inconsistent state inform user (to delete executions, etc.)...TODO:
			return Promise.resolve(false);
		}

		// execution was timed but is no longer active => cancel
		if (!currentExecution.record.active && originalExeRec.IsTimed) {
			await this.database.ExecutionDatabase?.UpdateExecutionsState(
				executionState.CANCELED,
				{ executionIDs: [currentExecution.id as number] }
			);

			// todo:
			return Promise.resolve(false);
		}

		// set execution as running if everything ok
		await this.database.ExecutionDatabase?.UpdateExecutionsState(
			executionState.RUNNING,
			{ executionIDs: [currentExecution.id as number] }
		);

		return Promise.resolve(currentExecution);
	}
}
