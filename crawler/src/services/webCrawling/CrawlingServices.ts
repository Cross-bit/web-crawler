import ExecutionsScheduler from "./executionScheduler";
import CrawlingExecutor from "./CrawlingExecutor"
import CrawlersPool from "./crawlersPool"
import ExecutionsQueue from "./executionsQueue"
import IExecutionsScheduler, {ICrawlersPool, IExecutionQueuesManager} from "./interface";
import { IDatabaseWrapper, IExecutionsDatabase, INodesDatabase, IRecordsDatabase, ITagsDatabase } from "../../database/interface";
import { DatabaseWrapper, ExecutionDatabaseWrapper, NodesDatabaseWrapper, RecordsDatabaseWrapper } from "../../database/postgress/dbWrappers";
import ExecutionQueuesManager from "./executionQueueManager";
import ExecutionsRecord from "./executionRecord";

/*
    "Singleton like" instances of crawling 
*/


export const crawlersPool: ICrawlersPool = new CrawlersPool(
    +(process.env.CRAWLER_INI_INSTANCES || 4), 
    +(process.env.CRAWLER_INSTANCES_MAX || 7),
    process.env.CRAWLER_EXE_LOCATION
    );


const executionDatabase:IExecutionsDatabase = new ExecutionDatabaseWrapper();
const recordsDatabase:IRecordsDatabase = new RecordsDatabaseWrapper();
const nodesDatabase:INodesDatabase = new NodesDatabaseWrapper();
//const tagsDatabase:IRecordsDatabase = 

export const databaseWrapper: IDatabaseWrapper = new DatabaseWrapper(executionDatabase, recordsDatabase, nodesDatabase);

const executionQueueManager: IExecutionQueuesManager = new ExecutionQueuesManager();
export const executionsScheduler: IExecutionsScheduler = new ExecutionsScheduler(databaseWrapper, executionQueueManager);

const executor:CrawlingExecutor = new CrawlingExecutor(executionsScheduler, crawlersPool, executionQueueManager, databaseWrapper);
executor.Execute();

/*executionQueueManager.InsertExecutionRecord(new ExecutionsRecord(0, 42, true, new Date()));
executionQueueManager.InsertExecutionRecord(new ExecutionsRecord(0, 42, true, new Date()));
executionQueueManager.InsertExecutionRecord(new ExecutionsRecord(1, 42, true, new Date()));
executionQueueManager.InsertExecutionRecord(new ExecutionsRecord(2, 42, true, new Date()));
executionQueueManager.InsertExecutionRecord(new ExecutionsRecord(0, 42, true, new Date()));*/
/*const qManager = new ExecutionQueuesManager();

const exeR = [
    new ExecutionsRecord(0, 42, true, new Date()),
    new ExecutionsRecord(1, 24, true, new Date()),
    new ExecutionsRecord(2, 25, true, new Date()),
    new ExecutionsRecord(3, 26, true, new Date()),
    new ExecutionsRecord(4, 27, true, new Date())
];

exeR.forEach(record => qManager.InsertExecutionRecord({...record}));

//const it = qManager.TryToGetNextItem_();
/*let prot = 0;
while(prot <= 100){

    if(prot <=1)
    qManager.InsertExecutionRecord(new ExecutionsRecord(0, 42, true, new Date()));

    let it = qManager.TryToGetNextItem_();
    if (it) {
        console.log(it);
    }

    prot++;
}*/


/*for(const items of it) {
    console.log(items);
}*/