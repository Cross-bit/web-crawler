import { parentPort, workerData } from 'worker_threads'
import { IProcessWrapper } from '../interface';
import DataProcessor from "./DataProcessor"
import { ExecutionDataWithRecord, ExecutionNode, ExecutionNodeWithErrors } from "../../../database/interface";
import CrawlingError, { CrawlErrorsCodes } from '../../../Errors/CrawlingErrors/CrawlingWorkerError';
import { crawlersPool } from "../CrawlingServices"
import { DatabaseWrapper, ExecutionDatabaseWrapper, NodesDatabaseWrapper, RecordsDatabaseWrapper } from '../../../database/postgress/dbWrappers';

const executionDatabase = new ExecutionDatabaseWrapper();
const recordsDatabase= new RecordsDatabaseWrapper();
const nodesDatabase= new NodesDatabaseWrapper();

export const databaseWrapper = new DatabaseWrapper(executionDatabase, recordsDatabase, nodesDatabase);

const database = databaseWrapper;
const crawlerPool = crawlersPool;

const { exeData, isfirst } = workerData

const timeOut = Math.floor(Math.random() * 10000);

console.log("timeout " + timeOut);
const dataProcessor = new DataProcessor(database);

const crawlerProcess: IProcessWrapper = crawlerPool.GetProcessFromPool() as IProcessWrapper;

const ProcessingDoneCallback = () =>{
    parentPort?.postMessage("done " + exeData.id);

    if (crawlerProcess) {
        crawlerPool.ReturnProcessToThePool(crawlerProcess);
    }
}

dataProcessor.eventEmitter.on(
    "allChunksProcessed", 
    ProcessingDoneCallback
);


if (!crawlerProcess) {
    console.log("není crawler..." + exeData.id);
    // todo:   
}

crawlerProcess.SetStdoutCallback((data: Buffer) =>{
    const dataStr = data.toString('utf-8');
    dataProcessor.ProcessIncomingData(dataStr);
});


crawlerProcess.SetStderrCallback((error: Buffer) =>{
    if (crawlerProcess)
        crawlerPool.ReturnProcessToThePool(crawlerProcess);
    console.log("err");
    const dataStr = error.toString('utf-8');
    console.log(dataStr);
});

const GetCrawlStreamInput = (executionToRun: ExecutionDataWithRecord) => {
    const url = executionToRun.record.url.trim();
    const boundary = executionToRun.record.boundary.trim();
    return url + " " + boundary + "\n";
}

const crawlerInput = GetCrawlStreamInput(exeData);

console.log("start exe id: " + exeData.id);

const res = crawlerProcess.WriteToStdin(crawlerInput);

if (!res) {
    throw new CrawlingError(CrawlErrorsCodes.crawlerInputStreamFailed);
}  

/*parentPort.on("message", (data) => {
    
    //parentPort.postMessage({num: data.num, fib: getFib(data.num)});
});*/




// parentPort?.postMessage("z workera!!")
//console.log(data.exeData.id);

/*const crawlersPool: ICrawlersPool;
const dataProcessor: CrawledDataProcessor;
const database: IDatabaseWrapper
const crawlerProcess?: IProcessWrapper
const executionToRun?: ExecutionDataWithRecord
const sema?: Sema*/

