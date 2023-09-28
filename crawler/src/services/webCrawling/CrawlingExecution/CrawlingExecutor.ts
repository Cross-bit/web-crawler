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
	readonly crawlingWorkerPath;

	public ExecutionState = new EventEmitter();

	constructor (
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

		this.crawlingWorkerPath = path.join(
			__dirname,
			"ParallelCrawling/CrawlingWorker/CrawlingWorker.ts"
		);

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
			const executionToProcess =
				this.executinoQueueManager.TryToGetNextItem();
			
			if (!executionToProcess) {
				return;
			}

			// This is the record ID originally acquired we don't expect inconsistency in the execution (like someone changes this id in db etc.)
			const acquiredRecordId = executionToProcess.recordID;
			
			await this.workerSemaphore.acquire();


			console.log(`exe loop: rec. id(${executionToProcess?.recordID}); exe. id(${executionToProcess?.executionID})`);

			// Execution was canceled before the execution started
			if (executionToProcess?.executionID && this.bannedExecutions.has(executionToProcess.executionID)) {

				this.ExecutionState.emit('executionCanceled', executionToProcess);
				this.bannedExecutions.delete(executionToProcess?.executionID);
				this.workerSemaphore.release();
				
				// NOTE: We release the queue after the workerSemaphore so we can be MORE sure that immediate follower is not of the same record ID
				this.executinoQueueManager.ReleaseQueue(acquiredRecordId);
				return;
			}
			

			if (executionToProcess) {
				const updatedExecutionData =
					await this.TryToUpdateExecutionDatabase(executionToProcess);
				
					
				if (!updatedExecutionData) {
					this.workerSemaphore.release();
					this.executinoQueueManager.ReleaseQueue(acquiredRecordId);
					return;
				}
					
				await this.CleanUpObsolatedGraphData(executionToProcess.recordID);

				const crawlingWorker = new Worker(this.crawlingWorkerPath, { // TODO: This could be done better using pool
					workerData: {
						exeData: { ...updatedExecutionData },
					},
				});

				this.executingWorkers.set(executionToProcess.executionID, crawlingWorker);

				crawlingWorker.on("message", async (event: any) => {

					const executionData = { ...executionToProcess };

					if (event.type && event.type == "done") {
						
						this.OnExecutionDone(executionData, event.crawlTime); // TODO: error handling
						crawlingWorker.terminate(); // kill the crawlingWorker TODO: use pool
						this.executingWorkers.delete(executionData.executionID);

						this.workerSemaphore.release();
						this.executinoQueueManager.ReleaseQueue(acquiredRecordId);
					}
					// else TODO: hanlde error because we dont expect anything else...
				});
			} else {
				this.workerSemaphore.release();

				this.executinoQueueManager.ReleaseQueue(acquiredRecordId);
			}
		}, this.executionPeriod);
	}

	public Dispose() {
		// todo: shut down all intervals... etc.
	}

	public async ForceCancleExecutionById(executionID: number) {
		
		if (!this.executingWorkers.has(executionID)) 
			this.bannedExecutions.add(executionID); // we are not executing yet
		else {
			
			const worker = this.executingWorkers.get(executionID) as Worker; // we want to cancle execution
			worker.postMessage({ command: 'HALT' });

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

		const updatedExecution = await this.UpdateExecutionDatabaseOnExeDone(originalExeRec.executionID, crawlTime);

		// notify scheduler that execution is done
		this.ExecutionState.emit('executionDone', updatedExecution);
	}

	/**
	 * Updates state of execution record in database once the execution is done.
	 * @param executionID - id of the execution record, that finished its execution. 
	 */
	private async UpdateExecutionDatabaseOnExeDone
	(executionID: number, crawlTime: number): Promise<ExecutionDataWithRecord>  {
		const updatedExecution = await this.database.ExecutionDatabase?.UpdateExecutionsState(
			executionState.DONE,
			{ executionIDs: [executionID] }
		) as ExecutionDataWithRecord[];
		
		await this.database.ExecutionDatabase?.UpdateExecutionsDuration(
			crawlTime,
			{ executionIDs: [executionID] }
		);

		updatedExecution[0].executionDuration = crawlTime;

		return Promise.resolve(updatedExecution[0]);
	}

	/**
	 * We only keep graph data for the currently running execution
	 * => this method deletes all previously crawled data in the db by given recordId
	 * @param recordId 
	 */
	private async CleanUpObsolatedGraphData(recordId: number) {
		console.log("deleting old graph data from db" + recordId);
		await this.database.NodesDatabase?.DeleteAllGraphDataByRecordId(recordId);
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

		// ASAP we want to update the execution start time
		const realStartTime = new Date();
		/*await this.database.ExecutionDatabase?.UpdateExecutionsStartTime(realStartTime, currentExecution.id as number);
		await this.database.ExecutionDatabase?.UpdateExecutionsSequenceNumber(realStartTime, currentExecution.id as number);*/
		console.log("tady setting sn");
		await this.database.ExecutionDatabase?.UpdateExecutionOnExecutionStart(realStartTime, currentExecution.id as number);
			
		if (!currentExecution.record) {
			// if record does not longer exist but the execution record does => 
			// => inconsistent state inform user (to delete executions, etc.)...TODO:
			return Promise.resolve(false);
		}

		// execution was timed but is no longer active => cancel
		if (!currentExecution.record.active && originalExeRec.IsTimed) {
			const canceledExecutions = await this.database.ExecutionDatabase?.UpdateExecutionsState(
				executionState.CANCELED,
				{ executionIDs: [currentExecution.id as number] }
			) as ExecutionDataWithRecord[];

			this.ExecutionState.emit('executionCanceled', canceledExecutions[0]);

			// todo:
			return Promise.resolve(false);
		}

		// set execution as running if everything ok
		const executionSetRunning = await this.database.ExecutionDatabase?.UpdateExecutionsState(
			executionState.RUNNING,
			{ executionIDs: [currentExecution.id as number] }
		) as ExecutionDataWithRecord[];

		console.log(executionSetRunning);
		this.ExecutionState.emit('executionRunning', executionSetRunning[0]);
		
		if (executionSetRunning.length > 0)
			return Promise.resolve(executionSetRunning[0]);
		else
			return Promise.resolve(false);
	}
}
