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
import CrawlingWorker from './crawlingWorker';

export class CrawlingExecutor {

    scheduler: IExecutionsScheduler;
    execute: boolean;
    crawlerPool: ICrawlersPool;
    executinoQueueManager: IExecutionQueuesManager;
    executionPeriod: number;
    pool: genericPool.Pool<CrawlingWorker>;
    database: IDatabaseWrapper

    constructor (scheduler: IExecutionsScheduler, crawlerPool: ICrawlersPool, executionQManager: IExecutionQueuesManager, database: IDatabaseWrapper) {
        this.scheduler = scheduler;
        this.execute = true;
        this.crawlerPool = crawlerPool;
        this.executinoQueueManager = executionQManager;
        this.executionPeriod = 1000; // check every second
        this.database = database;

        this.pool = genericPool.createPool({
            create: async () => new CrawlingWorker(this.crawlerPool),
            destroy: async (worker: CrawlingWorker) => { worker.terminate() },
            
        }, {
            max: 8,
            min: 4,
            idleTimeoutMillis: 30000,
            acquireTimeoutMillis: 5000,
        })
    }

    async UpdateRecordsState(originalExeRec: ExecutionsRecord) : Promise<ExecutionDataWithRecord | false> 
    {   
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

    async Execute() {

        // TODO: change this to more passive waiting

        setInterval(async () => {
            const executionToProcess = this.executinoQueueManager.TryToGetNextItem();

            if (executionToProcess) {
               // try {
                    const crawlingWorker = await this.pool.acquire();
                    const updatedExecutionData = await this.UpdateRecordsState(executionToProcess)
                    if (!updatedExecutionData) {
                        // todo: throw smth ... or it went wrong..
                        return;
                    }

                    crawlingWorker.run(updatedExecutionData);
                    this.pool.release(crawlingWorker);
                //}
                //catch(err)
                //{
                //    // TODO:
                //}
                
            }else{
                //console.lo("nothing todo...");
            }
        }, this.executionPeriod);
   
    }

    RunExecution(execution: ExecutionsRecord) {
        return;
    }

    OnExecutionFinished() {
        return;
    }
} 


export default class ExecutionsScheduler implements IExecutionsScheduler
{

    /**
     * Maps record id to its execution queue
     */
    private executionQManager: IExecutionQueuesManager

    /**
     * interface for accessing database(data-access) layer
     */
    private database: IDatabaseWrapper;

    /**
     * Maps executions to their cron scheduling task
     */
    cronPlannedExecutions: Map<ExecutionDataWithRecord, ScheduledTask>
    
    /**
     * Event to inform subscribers(logging service, user information service...) about current stage of scheduling.
    */
    public SchedulingStageEmitter = new EventEmitter();


    constructor(executionDatabase: IDatabaseWrapper, executinoQueueManager: IExecutionQueuesManager) {
        this.executionQManager = new ExecutionQueuesManager();
        this.cronPlannedExecutions = new Map<ExecutionDataWithRecord, ScheduledTask>();
        this.database = executionDatabase;
        this.executionQManager = executinoQueueManager;
    }

    public async CreateNewExecutionForRecord(recordData: RecordData, isTimed: boolean) {

        const exeData: ExecutionDataWithRecord = {
            creation: new Date(),
            executionStart: null,
            executionDuration: 0,
            state: executionState.CREATED,
            isTimed: isTimed,
            record: recordData
        }
                
        // set first execution time 
        if (exeData.isTimed)
            exeData.executionStart = new Date(this.GetDateTimeOfNextExecution(exeData));

        // create execution in db

        const newExecutionId =  await this.database.ExecutionDatabase?.insertExecution(
            {...exeData, recordId: recordData.id} as ExecutionData);

        exeData.id = newExecutionId;

        // plan execution timer
        if (isTimed)
            await this.SetExecutionWaiting(exeData);
        else
            this.PlanExecutionCallback(exeData)
    }

    public async DeleteRecordExecutions() {
        // TODO: delete appropriate planning queue
    }


    /**
     * For Periodicall executions, sets system timer for particular time in the future.
     * @param executionData
     */
    public async SetExecutionWaiting(executionData: ExecutionDataWithRecord) {

        if (!executionData.record.id || !executionData.id || !executionData.isTimed || !executionData.executionStart)
            return; // TODO: handle error better

        // create cron timer
        const executionTime = executionData.executionStart;

        const cronExpression = this.CalculateCronExpression(executionTime);

        const cronTask: ScheduledTask = cron.schedule(cronExpression, 
                        () => this.PlanExecutionCallback(executionData));

        this.cronPlannedExecutions.set(executionData, cronTask);
        
        // update db state:
        await this.database.ExecutionDatabase?.UpdateExecutionsState(executionState.WAITING, { executionIDs:[executionData.id] });
    }

    public GetDateTimeOfNextExecution(executionData: ExecutionDataWithRecord): number {

        let timeDifference = (executionData.record.periodicity_day * 24 * 60);
        timeDifference += (executionData.record.periodicity_hour * 60); 
        timeDifference += (executionData.record.periodicity_min);
        timeDifference *= 60 * 1000; // Convert minutes to miliseconds

        if (!executionData.executionStart)
            return ((new Date()).getTime() + timeDifference)
        
        return (executionData.executionStart.getTime() + timeDifference)
    }

    /**
     * On application start.
     * @returns
    */
    public async SynchronizeData() {

        const filter: ExecutionsDataFilter = {
            state: [ executionState.CREATED, executionState.PLANNED, executionState.RUNNING, executionState.WAITING ]
        }

        const allUnfinishedExecutions = await this.database.ExecutionDatabase?.UpdateExecutionsState(executionState.INCOMPLETE, filter);


        console.log(allUnfinishedExecutions)
        // simply replan all the executions ... TODO: do this more sofisticated??

        /*const createExecutionPromise = allUnfinishedExecutions?.map((execution) => this.CreateNewExecutionForRecord(execution.record, execution.isTimed))
        await Promise.all(createExecutionPromise || []);*/
    }

    public RescheduleExecution(execution: ExecutionDataWithRecord) {

        /*if (execution.isTimed) {
            // plan TODO:
        }
        else {

        }*/

        return;
    }

    /**
     * Converts Date object to cron timing string
     * @param dateTime 
     * @returns 
     */
    private CalculateCronExpression(dateTime: Date): string {
        dateTime = new Date();
        const minute = dateTime.getMinutes();
        const hour = dateTime.getHours();
        const dayOfMonth = dateTime.getDate();
        const month = dateTime.getMonth() + 1; // months are zero based
        const dayOfWeek = dateTime.getDay();
        const seconds = dateTime.getSeconds() + 5;
        // TODO: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! for testing purposes!!!

        return `${seconds} ${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`
    }

    /**
     * Plans execution to the execution queue (Is supposed to be raised by a timer when the time has come)
     * @param originalExecution Original executions data when callback was set.
     * @returns
     */
    private async PlanExecutionCallback(originalExecution: ExecutionDataWithRecord)  {

        const exeFilter = {executionIDs:[ originalExecution.id as number ]}

        let currentExecution = originalExecution;

        if(currentExecution.isTimed)
            currentExecution = (await this.database.ExecutionDatabase?.GetExecutionsWithRecord(exeFilter) || [ undefined ])[0] as ExecutionDataWithRecord;

        if (!currentExecution) {
            return; // the execution record doesnt exist anymore!! we should inform user... TODO: throw error
        }

        if (!currentExecution.record) { 
            // if record doesnt exist but the execution record does => inconsistent state inform user and delete executions...TODO:
            return;
        }

        if (!currentExecution.record.active && currentExecution.isTimed) { 
            // is timed but record is no longer active => is should not be scheduled...
            await this.database.ExecutionDatabase?.UpdateExecutionsState(executionState.CANCELED, {executionIDs:[ currentExecution.id as number ]});
            return;
        }

        this.PlanExecutionToCorrespondingQueue(currentExecution);
        
        // set record as planned (in queue)
        await this.database.ExecutionDatabase?.UpdateExecutionsState(executionState.PLANNED, {executionIDs:[ originalExecution.id as number ]});

    }

    private PlanExecutionToCorrespondingQueue(executionData: ExecutionDataWithRecord) {
        try
        {
            const webRecordId: number = executionData.record.id;

            const executionStart: Date = executionData.executionStart as Date;// TODO: null??

            const executionRecord = new ExecutionsRecord(webRecordId, executionData.id as number, executionData.isTimed, executionStart);
    
            this.executionQManager.InsertExecutionRecord(executionRecord);
            /*let correspondingQ = this.executions.get(webRecordId);
    
            if (!correspondingQ) {
                correspondingQ = new ExecutionsPriorityQueue();
                this.executions.set(webRecordId, correspondingQ);
            }
    
            correspondingQ.Push(executionRecord);*/

        }
        catch(err){
            // todo: handle error

        }
    }

}