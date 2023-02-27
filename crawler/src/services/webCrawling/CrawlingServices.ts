import ExecutionsScheduler from "./executionScheduler";
import CrawlersPool from "./crawlersPool"
import ExecutionsQueue from "./executionsQueue"
import IExecutionsScheduler, {ICrawlersPool} from "./interface";


export const crawlersPool: ICrawlersPool = new CrawlersPool(4, 8, process.env.CRAWLER_EXE_LOCATION);
export const executionsScheduler: IExecutionsScheduler = new ExecutionsScheduler();



