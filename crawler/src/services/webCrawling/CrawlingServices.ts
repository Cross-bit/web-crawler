import ExecutionsScheduler from "./executionScheduler";
import CrawlersPool from "./crawlersPool"
import ExecutionsQueue from "./executionsQueue"
import IExecutionsScheduler, {ICrawlersPool} from "./interface";
import { IExecutionsDatabase } from "../../database/interface";
import { ExecutionDatabaseWrapper } from "../../database/postgress/dbWrappers";

/*
    "Singleton like" instances of crawling 
*/


export const crawlersPool: ICrawlersPool = new CrawlersPool(
    +(process.env.CRAWLER_INI_INSTANCES || 4), 
    +(process.env.CRAWLER_INSTANCES_MAX || 7),
    process.env.CRAWLER_EXE_LOCATION
    );

const databaseWrapper: IExecutionsDatabase = new ExecutionDatabaseWrapper();

export const executionsScheduler: IExecutionsScheduler = new ExecutionsScheduler(databaseWrapper);