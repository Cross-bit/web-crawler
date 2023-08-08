import { parentPort, workerData } from "worker_threads";
import { IProcessWrapper } from "../../../interface";
import  CrawledDataProcessor from "./DataProcessor";
import { ExecutionDataWithRecord, ExecutionNodeConnections, ExecutionNodeWithErrors } from "../../../../../database/interface";
import CrawlingError, {
	CrawlErrorsCodes,
} from "../../../../../Errors/CrawlingErrors/CrawlingWorkerError";
import { crawlersPool } from "../../../CrawlingServices";
import {
	DatabaseWrapper,
	ExecutionDatabaseWrapper,
	NodesDatabaseWrapper,
	RecordsDatabaseWrapper,
} from "../../../../../database/postgress/dbWrappers";
import CrawledDataPublisher from "./DataPublishing/DatabasePublishingService"
import CrawledDataChunk from "./interface";


/**
 * TODO: description
 * 
 */

const executionDatabase = new ExecutionDatabaseWrapper();
const recordsDatabase = new RecordsDatabaseWrapper();
const nodesDatabase = new NodesDatabaseWrapper();

export const databaseWrapper = new DatabaseWrapper(
	executionDatabase,
	recordsDatabase,
	nodesDatabase
);

const database = databaseWrapper;
const crawlerPool = crawlersPool;

const { exeData } = workerData;

const timeOut = Math.floor(Math.random() * 10000);

console.log("timeout " + timeOut);

const dataPublisher = new CrawledDataPublisher(database, exeData);

const dataProcessor = new CrawledDataProcessor(database, dataPublisher, exeData);


const crawlerProcess: IProcessWrapper =
	crawlerPool.GetProcessFromPool() as IProcessWrapper;


const ProcessingDoneCallback = (crawlTime: number) => {
	parentPort?.postMessage(
		{
			type: "done",
			id: exeData.id,
			crawlTime
		});

	if (crawlerProcess) {
		crawlerPool.ReturnProcessToThePool(crawlerProcess);
	}
};


// TODO: solve if it is true that we destroy the paralelism
// that we first send all the nodes and then we send all the edges...
const OnEdgePublished = (edgePublished: ExecutionNodeConnections) =>
{
	console.log("edge event: ");
	console.log(edgePublished);
}

const OnNodePublished = (edgePublished: ExecutionNodeWithErrors) =>
{
	console.log("node event: ");
	console.log(edgePublished);
}


dataPublisher.eventEmitter.on("onEdgePublished", OnEdgePublished)
dataPublisher.eventEmitter.on("onNodePublished", OnNodePublished)

dataProcessor.eventEmitter.on("allChunksProcessed", ProcessingDoneCallback);

//dataProcessor.eventEmitter.on("newDataChunkReady", NewDataChunkReady);


if (!crawlerProcess) {
	console.log("není crawler..." + exeData.id);
	// TODO: hadle this situation correctly
}

crawlerProcess.SetStdoutCallback((data: Buffer) => {
	const dataStr = data.toString("utf-8");
	dataProcessor.ProcessIncomingData(dataStr);
});

crawlerProcess.SetStderrCallback((error: Buffer) => {
	if (crawlerProcess) crawlerPool.ReturnProcessToThePool(crawlerProcess);
	console.log("err");
	const dataStr = error.toString("utf-8");
	console.log(dataStr);
});

const GetCrawlStreamInput = (executionToRun: ExecutionDataWithRecord) => {
	const url = executionToRun.record.url.trim();
	const boundary = executionToRun.record.boundary.trim();
	return url + " " + boundary + "\n";
};

const crawlerInput = GetCrawlStreamInput(exeData);

console.log("start exe id: " + exeData.id);

const res = crawlerProcess.WriteToStdin(crawlerInput);

if (!res) {
	throw new CrawlingError(CrawlErrorsCodes.crawlerInputStreamFailed);
}

// worker.ts


parentPort?.on('message', (message) => {

	// TODO: move to enum/constant
	if(message == "HALT") {
		crawlerProcess.WriteToStdin("HALT"); // halt crawler

		if (crawlerProcess) // return crawler to the pool
			crawlerPool.ReturnProcessToThePool(crawlerProcess);
	}
});
  
