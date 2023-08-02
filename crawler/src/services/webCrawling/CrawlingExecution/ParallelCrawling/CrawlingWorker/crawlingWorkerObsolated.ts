import { Worker } from "worker_threads";
import {
	ExecutionDataWithRecord,
} from "../../../../../database/interface";
import ExecutionsRecord from "../../executionRecord";
import { ICrawlersPool, IProcessWrapper } from "../../../interface";
import { IDatabaseWrapper } from "../../../../../database/interface";
import { ProcessWrapper } from "../CrawlersProcessPool";
import CrawlingError, {
	CrawlErrorsCodes,
} from "../../../../../Errors/CrawlingErrors/CrawlingWorkerError";
import { Sema } from "async-sema";
import CrawledDataProcessor from "./DataProcessor";

// this was attepmt to do make Crawling Worker in OOP fashion

/*export default class CrawlingWorker extends Worker {
	crawlersPool: ICrawlersPool;
	dataProcessor: CrawledDataProcessor;
	database: IDatabaseWrapper;
	crawlerProcess?: IProcessWrapper;
	executionToRun?: ExecutionDataWithRecord;
	sema?: Sema;

	constructor(
		crawlerPool: ICrawlersPool,
		database: IDatabaseWrapper,
		semaphore: Sema
	) {
		super(__filename);

		this.crawlersPool = crawlerPool;
		this.database = database;
		this.sema = semaphore;

		this.dataProcessor = new CrawledDataProcessor(database, );

		this.dataProcessor.eventEmitter.on(
			"allChunksProcessed",
			this.ProcessingDoneCallback.bind(this)
		);

		this.on("message", this.HandleMessage);
	}

	private HandleMessage(message: any) {
		//
	}

	public run(executionToRun: ExecutionDataWithRecord) {
		this.executionToRun = executionToRun;
		this.crawlerProcess = this.crawlersPool.GetProcessFromPool();

		if (!this.crawlerProcess) {
			console.log("není crawler..." + executionToRun.id);
			// todo: throw Error ... max number of crawlers processes reached
			return;
		}

		this.crawlerProcess.SetStdoutCallback(this.StdoutCallback.bind(this));
		this.crawlerProcess.SetStderrCallback(this.StderrCallback.bind(this));

		const crawlerInput = this.GetCrawlStreamInput(executionToRun);

		console.log("start exe id: " + executionToRun.id);

		const res = this.crawlerProcess.WriteToStdin(crawlerInput);

		if (!res) {
			throw new CrawlingError(CrawlErrorsCodes.crawlerInputStreamFailed);
		}
	}

	private ProcessingDoneCallback() {
		if (this.crawlerProcess) {
			// console.log("returned " + this.executionToRun?.id);
			this.crawlersPool.ReturnProcessToThePool(this.crawlerProcess);
		}
		console.log(
			"processing done " +
				this.executionToRun?.id +
				" from tid: " +
				this.threadId
		);
		this.executionToRun = undefined;
		this.crawlerProcess = undefined;
		//if(this.sema?.)

		this.sema?.release();
		console.log(this.sema?.nrWaiting());

		if (this.threadId != -1)
			//this.postMessage({ type: 'done' });
			//parentPort?.postMessage({ type: 'done' });
			this.emit("message", { type: "done" });

		this.terminate();
	}

	private StderrCallback(error: Buffer) {
		if (this.crawlerProcess)
			this.crawlersPool.ReturnProcessToThePool(this.crawlerProcess);
		console.log("err");
		const dataStr = error.toString("utf-8");
		console.log(dataStr);
		this.postMessage({ type: "error", error: error });
	}

	private GetCrawlStreamInput(executionToRun: ExecutionDataWithRecord) {
		const url = executionToRun.record.url.trim();
		const boundary = executionToRun.record.boundary.trim();
		return url + " " + boundary + "\n";
	}

	private StdoutCallback(data: Buffer) {
		const dataStr = data.toString("utf-8");
		this.dataProcessor.ProcessIncomingData(dataStr);
	}
}
*/