import ExecutionsScheduler from "./executionScheduler";
import CrawlersPool from "./crawlersPool"
import ExecutionsQueue from "./executionsQueue"
import IExecutionsScheduler, {ICrawlersPool} from "./interface";
import { IDatabaseWrapper, IExecutionsDatabase, IRecordsDatabase, ITagsDatabase } from "../../database/interface";
import { DatabaseWrapper, ExecutionDatabaseWrapper, RecordsDatabaseWrapper } from "../../database/postgress/dbWrappers";

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
//const tagsDatabase:IRecordsDatabase = 

const databaseWrapper: IDatabaseWrapper = new DatabaseWrapper(executionDatabase, recordsDatabase);

export const executionsScheduler: IExecutionsScheduler = new ExecutionsScheduler(databaseWrapper);