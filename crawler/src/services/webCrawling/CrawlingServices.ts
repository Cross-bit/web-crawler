import ExecutionsScheduler from "./CrawlingExecution/ExecutionScheduling/executionScheduler";
import CrawlingExecutor from "./CrawlingExecution/CrawlingExecutor"
import CrawlerProcessPool from "./CrawlingExecution/ParallelCrawling/CrawlersProcessPool"
import IExecutionsScheduler, {ICrawlersPool, IExecutionQueuesManager} from "./interface";
import { IDatabaseWrapper, IExecutionsDatabase, INodesDatabase, IRecordsDatabase } from "../../database/interface";
import { DatabaseWrapper, ExecutionDatabaseWrapper, NodesDatabaseWrapper, RecordsDatabaseWrapper } from "../../database/postgress/dbWrappers";
import ExecutionQueuesManager from "./CrawlingExecution/ExecutionScheduling/executionQueueManager";
import ExecutionStatePublisher from "./CrawlingExecution/ExecutionStatePublisher";

/*
    "Singleton like" instances of all the crawling objects
*/

export const crawlersPool: ICrawlersPool = new CrawlerProcessPool(
    +(process.env.CRAWLER_INI_INSTANCES || 4), 
    +(process.env.CRAWLER_INSTANCES_MAX || 7),
    process.env.CRAWLER_EXE_LOCATION
);


const executionDatabase: IExecutionsDatabase = new ExecutionDatabaseWrapper();
const recordsDatabase: IRecordsDatabase = new RecordsDatabaseWrapper();
const nodesDatabase: INodesDatabase = new NodesDatabaseWrapper();

export const databaseWrapper: IDatabaseWrapper = new DatabaseWrapper(executionDatabase, recordsDatabase, nodesDatabase);

const executionQueueManager: IExecutionQueuesManager = new ExecutionQueuesManager();

const executor:CrawlingExecutor = new CrawlingExecutor(crawlersPool, executionQueueManager, databaseWrapper);

export const executionsScheduler: IExecutionsScheduler = new ExecutionsScheduler(executor, databaseWrapper, executionQueueManager);

export const executionStatePublisher: ExecutionStatePublisher = new ExecutionStatePublisher(executionsScheduler as ExecutionsScheduler);


executor.Execute();