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
import DatabaseDataPublisher from "./DataPublishing/DatabasePublishingService"
import MsgQueueDataPublisher from "./DataPublishing/MessagingQueuePublishingService"
import CrawledDataChunk from "./interface";
import EventSynchronizer from "./DataPublishing/EventSynchronisator"


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


const { exeData }: { exeData: ExecutionDataWithRecord }  = workerData;

const dbDataPublisher = new DatabaseDataPublisher(database, exeData);

const dataProcessor = new CrawledDataProcessor(database, dbDataPublisher, exeData);

//
// Events that have to end before worker can be disposed (which means all)
//

// special synchronisation structure raising event once all the events are done.
const syncCoordinator = new EventSynchronizer(dataProcessor);

syncCoordinator.addEvent(dbDataPublisher.eventEmitter, "onNodePublished", dataProcessor.GetTotalNumberOfNodes.bind(dataProcessor), 
(nodeData) => {
	//console.log(nodeData);
	MsgQueueDataPublisher.publishNodeData(nodeData, exeData.id as number)
});

syncCoordinator.addEvent(dbDataPublisher.eventEmitter, "onEdgePublished", dataProcessor.GetTotalNumberOfEdges.bind(dataProcessor), 
(edgeData) => {
	//console.log(edgeData);
	MsgQueueDataPublisher.publishEdgeData(edgeData, exeData.record.id, exeData.id as number)
});



const crawlerProcess: IProcessWrapper =
	crawlerPool.GetProcessFromPool() as IProcessWrapper;

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

const GetCrawlInitStreamInput = (executionToRun: ExecutionDataWithRecord) => {
	const url = executionToRun.record.url.trim();
	const boundary = executionToRun.record.boundary.trim();
	return url + " " + boundary + "\n";
};


//
// worker initialisation 
//

(async () =>{

	// starts execution here
	console.log("start crawling for exe id: " + exeData.id);

	const crawlerInitInput = GetCrawlInitStreamInput(exeData);
	console.log(crawlerInitInput);
	await MsgQueueDataPublisher.Connect();

	const res = crawlerProcess.WriteToStdin(crawlerInitInput);

	if (!res) {
		throw new CrawlingError(CrawlErrorsCodes.crawlerInputStreamFailed);
	}
})();

//
// Worker termination
//

/*
* Handling crawling thread done announcement(so parent can "kill" the thread) 
*/

syncCoordinator.eventEmitter.on("allExecutionsDone", () => {

	console.log(`(rid: ${exeData.record.id} exe: ${exeData.id}) All processes in the worker done, informing parent port...`);
	parentPort?.postMessage(
		{
			type: "done",
			id: exeData.id,
			crawlTime: dbDataPublisher.TotalCrawlTime,
		}
	);
})

/*
* Handling crawling process release
*/

dataProcessor.eventEmitter.on("allChunksAccepted", 
() => {
	console.log(`(rid:${exeData.record.id} exe: ${exeData.id}) All chunks accepted, releasing crawler...`);
	
	if (crawlerProcess) {
		crawlerPool.ReturnProcessToThePool(crawlerProcess);
	}
});


//
// -- messages from parent --
//

parentPort?.on('message', (message) => {

	// TODO: move to enum/constant
	if(message == "HALT") {
		if (crawlerProcess) // return crawler to the pool
		{
			console.log("halting the crawler");
			crawlerProcess.WriteToStdin("HALT"); // halt crawler
			
			crawlerPool.ReturnProcessToThePool(crawlerProcess);
		}
	}
});
  