import { GetExecutions } from '../../database/postgress/executionsDatabase'
import { ExecutionData, ExecutionDataWithRecord, ExecutionsDataFilter, IDatabaseWrapper, IExecutionsDatabase, RecordData, RecordDataPartial } from '../../database/interface'

import cron, { ScheduledTask } from 'node-cron';
import ExecutionsRecord from './executionRecord'
import ExecutionsPriorityQueue from './executionsQueue'
import CrawlersPool from './crawlersPool'
import IExecutionsScheduler, { ICrawlersPool, IExecutionQueuesManager } from  './interface'
import { executionState } from '../../utils/enums';
import EventEmitter from 'events';
import ExecutionQueuesManager from './executionQueueManager'
import * as genericPool from 'generic-pool'
//import CrawlingWorker from './CrawlingWorker/crawlingWorker';
//import * as crawlingWorker from './CrawlingWorker/crawlingWorker2';
import { Sema } from 'async-sema';
import { Worker } from 'worker_threads';
import path from "path"

export default class CrawlingExecutor 
{

    workerSemaphore:Sema;

    scheduler: IExecutionsScheduler;
    execute: boolean;
    crawlerPool: ICrawlersPool;
    executinoQueueManager: IExecutionQueuesManager;
    executionPeriod: number;
  //  pool: genericPool.Pool<CrawlingWorker>;
    database: IDatabaseWrapper

    constructor (scheduler: IExecutionsScheduler, crawlerPool: ICrawlersPool, executionQManager: IExecutionQueuesManager, database: IDatabaseWrapper) {
        this.scheduler = scheduler;
        this.execute = true;
        this.crawlerPool = crawlerPool;
        this.executinoQueueManager = executionQManager;
        this.executionPeriod = 1000; // check every second
        this.database = database;

        this.workerSemaphore = new Sema(+(process.env.CRAWLER_INI_INSTANCES || 0));

        /*this.pool = genericPool.createPool({
            create: async () => new CrawlingWorker(this.crawlerPool, this.database),
            destroy: async (worker: CrawlingWorker) => { worker.terminate() },
            
        }, {
            max: +(process.env.CRAWLER_INI_INSTANCES || 0), 
            min: +(process.env.CRAWLER_INI_INSTANCES || 0),
            idleTimeoutMillis: 30000,
            acquireTimeoutMillis: 5000,
        })*/
    }
    // TODO: change this to more passive waiting

   // crawlingWorkders: CrawlingWorker[] = []
    first:boolean = true;
    async Execute() {
        setInterval(async () => {

            //console.log("called " + this.executinoQueueManager.GetSize());
            await this.workerSemaphore.acquire();
            const executionToProcess = this.executinoQueueManager.TryToGetNextItem();
            if (executionToProcess)
                console.log("running: " + executionToProcess?.executionID);

            if (executionToProcess) {

              //  const crawlingWorker: CrawlingWorker = await this.pool.acquire();
                //this.crawlingWorkders.push(crawlingWorker);

                const updatedExecutionData = await this.TryToUpdateExecutionDatabase(executionToProcess);
              //  console.log("updated " + executionToProcess?.executionID);
                if (!updatedExecutionData) {
                    this.workerSemaphore.release();
                    return;
                }
                
             //   const crawlingWorker = new CrawlingWorker(this.crawlerPool, this.database, this.workerSemaphore);
                const crawlerPath = path.join(__dirname, "CrawlingWorker/crawlingWorker2.ts");
                
                const crawlingWorker  = new Worker( crawlerPath, {
                       workerData:{
                        exeData: { ...updatedExecutionData },
                        isfirst: this.first
                    }
                });
                this.first = false;

                crawlingWorker.on('message', async (event:any) => {
                    console.log(event);
                    this.workerSemaphore.release();
                    /*if (event.type == 'done') {
                        
                        //console.log("done: " + executionToProcess.executionID);
                        //console.log(this.pool);
                        //this.pool.release(crawlingWorker);
                        this.workerSemaphore.release();

                        //crawlingWorker.terminate();
                    }*/
               });

                //crawlingWorker.run(updatedExecutionData);


            }
            else {
                this.workerSemaphore.release();
            }
        }, this.executionPeriod);
   
    }


    
    /**
     * Tries to update execution record in db if is planned
     * @param originalExeRec 
     * @returns 
     */
    async TryToUpdateExecutionDatabase(originalExeRec: ExecutionsRecord) : Promise<ExecutionDataWithRecord | false> {   
        const exeFilter = {executionIDs:[ originalExeRec.executionID as number ]}

        const currentExecution = (await this.database.ExecutionDatabase?.GetExecutionsWithRecord(exeFilter) || [ undefined ])[0] as ExecutionDataWithRecord;
    
        if (!currentExecution) {
            // throw error 
            Promise.resolve(false);
        }

        // record was timed but is no longer active => cancel
        if (!currentExecution.record.active && originalExeRec.IsTimed) { 
            await this.database.ExecutionDatabase?.UpdateExecutionsState(executionState.CANCELED, {executionIDs:[ currentExecution.id as number ]});
            // todo:
            Promise.resolve(false);
        }

        // set execution as running if everything ok
        await this.database.ExecutionDatabase?.UpdateExecutionsState(executionState.RUNNING, {executionIDs:[ currentExecution.id as number ]});

        return Promise.resolve(currentExecution);
    }

} 
