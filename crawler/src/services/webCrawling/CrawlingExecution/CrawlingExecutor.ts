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

export default class CrawlingExecutor {
	workerSemaphore: Sema;
	scheduler: IExecutionsScheduler;
	execute: boolean;
	crawlerPool: ICrawlersPool;
	executinoQueueManager: IExecutionQueuesManager;
	executionPeriod: number;
	pool: WorkerPool;
	database: IDatabaseWrapper;

	constructor(
		scheduler: IExecutionsScheduler,
		crawlerPool: ICrawlersPool,
		executionQManager: IExecutionQueuesManager,
		database: IDatabaseWrapper
	) {
		this.scheduler = scheduler;
		this.execute = true;
		this.crawlerPool = crawlerPool;
		this.executinoQueueManager = executionQManager;
		this.executionPeriod = 1000; // check every second
		this.database = database;

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
		setInterval(async () => {
			await this.workerSemaphore.acquire();
			const executionToProcess =
				this.executinoQueueManager.TryToGetNextItem();
			if (executionToProcess)
				console.log("running: " + executionToProcess?.executionID);

			if (executionToProcess) {
				const updatedExecutionData =
					await this.TryToUpdateExecutionDatabase(executionToProcess);

				if (!updatedExecutionData) {
					this.workerSemaphore.release();
					return;
				}

				const crawlerPath = path.join(
					__dirname,
					"CrawlingWorker/crawlingWorker2.ts"
				);

				const crawlingWorker = new Worker(crawlerPath, {
					workerData: {
						exeData: { ...updatedExecutionData },
					},
				});

				crawlingWorker.on("message", async (event: any) => {
					this.workerSemaphore.release();
				});
			} else {
				this.workerSemaphore.release();
			}
		}, this.executionPeriod);
	}

	/**
	 * Tries to update execution record in db if is planned
	 * @param originalExeRec
	 * @returns
	 */
	async TryToUpdateExecutionDatabase(
		originalExeRec: ExecutionsRecord
	): Promise<ExecutionDataWithRecord | false> {
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

		// record was timed but is no longer active => cancel
		if (!currentExecution.record.active && originalExeRec.IsTimed) {
			await this.database.ExecutionDatabase?.UpdateExecutionsState(
				executionState.CANCELED,
				{ executionIDs: [currentExecution.id as number] }
			);
			// todo:
			Promise.resolve(false);
		}

		// set execution as running if everything ok
		await this.database.ExecutionDatabase?.UpdateExecutionsState(
			executionState.RUNNING,
			{ executionIDs: [currentExecution.id as number] }
		);

		return Promise.resolve(currentExecution);
	}
}
