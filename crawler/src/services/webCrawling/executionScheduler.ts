import { GetExecutions } from '../../database/postgress/executionsDatabase'
import { ExecutionData, ExecutionDataWithRecord, IExecutionsDatabase, RecordData, RecordDataPartial } from '../../database/interface'
import cron, { ScheduledTask } from 'node-cron';
import ExecutionsRecord from './executionRecord'
import ExecutionsPriorityQueue from './executionsQueue'
import CrawlersPool from './crawlersPool'
import IExecutionsScheduler from  './interface'

/*export class ExecutionExecutor {

    executions: Map<number, ExecutionsPriorityQueue> // record id to its executions to be runned
    scheduler: ExecutionsScheduler;
    execute: boolean;
    crawlerPool: CrawlersPool;

    constructor (scheduler: ExecutionsScheduler, crawlerPool: CrawlersPool){
        this.executions = new Map<number, ExecutionsPriorityQueue>();
        this.scheduler = scheduler;
        this.execute = true;
        this.crawlerPool = crawlerPool;
    }

    Execute() {
        while (this.scheduler.executions.size != 0 && this.execute) {
            if (!this.crawlerPool.IsPoolFull()){
                const poolProcess = this.crawlerPool.GetProcessFromPool();
                // todo: ...
            }
        }
    }

    RunExecution(execution: ExecutionsRecord) {
        return;
    }

    OnExecutionFinished() {
        return;
    }
} */


/*

const scheduledTask = cron.schedule('* * * * *', () => {
    console.log("tadá every minuta"); // todo:
});*/

export default class ExecutionsScheduler implements IExecutionsScheduler
{

    private executions: Map<number, ExecutionsPriorityQueue> // record id to its executions to be runned
    private executionDb: IExecutionsDatabase;

    /**
     * Contains executions that are supposed to be planned 
     */
    cronPlannedExecutions: Map<number, ScheduledTask>

    constructor(executionDatabase: IExecutionsDatabase) {
        this.executions = new Map<number, ExecutionsPriorityQueue>();
        this.cronPlannedExecutions = new Map<number, ScheduledTask>();
        this.executionDb = executionDatabase;
    }

    /**
     * For Periodicall executions, sets system timer for particular time in the future.
     * @param executionData
     */
    public async SetExecutionWaiting(executionData: ExecutionDataWithRecord) {

        if (!executionData.record.id || !executionData.id || !executionData.isTimed)
            return; // todo: handle error better

        const webRecordId: number = executionData.record.id as number;

        const cronExpression = "";

        const executionTime = executionData.executionStart;

        //const cronExecutionStr = this.GetCronTimingString();

        const cronTask: ScheduledTask = cron.schedule("* * * * *", 
                        () => this.PlanExecutionCallback(executionData));
    }

    public GetDateTimeOfNextExecution(executionData: ExecutionDataWithRecord): number
    {   
        console.log(executionData);

        let numberOfMiliseconds = (executionData.record.periodicity_day * 24 * 60);
        console.log(numberOfMiliseconds);
        numberOfMiliseconds += (executionData.record.periodicity_hour * 60); 
        console.log(numberOfMiliseconds);
        numberOfMiliseconds += (executionData.record.periodicity_min);
        console.log(numberOfMiliseconds);
        numberOfMiliseconds *= 60 * 1000; //Convert minutes to miliseconds
        console.log(numberOfMiliseconds);

        if (!executionData.executionStart)
            return ((new Date()).getTime() + numberOfMiliseconds)
        
        return (executionData.executionStart.getTime() + numberOfMiliseconds)
    }

    /**
     * On application start.
     * @returns
    */
    public async SynchronizeData() {

        const allPlannedExecutions = await this.executionDb.GetExecutionsWithRecord();

        allPlannedExecutions?.forEach((executionDbData: ExecutionDataWithRecord) => {

            this.RescheduleExecution(
                executionDbData
                /*{
                    id: executionDbData.id,
                    creation: executionDbData.creation,
                    executionStart: executionDbData.executionStart,
                    executionTime: executionDbData.executionDuration,
                    isTimed: executionDbData.execution_time != null,
                    status: executionDbData.execution_status,
                    record: executionDbData.record // todo map correctly...
                }*/);
            });

        return;
    }

    public RescheduleExecution(execution: ExecutionDataWithRecord) {

        /*if (execution.isTimed) {
            // plan TODO:
        }
        else {

        }*/

        return;
    }


    private GetCronTimingString(executionStartTime: Date): string {

        return "* *"
    }

    /**
     * Plans execution to the execution queue.
     * @param executionData
     * @returns
     */
    private async PlanExecutionCallback(executionData: ExecutionDataWithRecord)  {

        if (!executionData.record.id || !executionData.id)
            return; // todo: handle error better

        const webRecordId: number = executionData.record.id;

        const executionStart: Date = executionData.executionStart as Date; // todo: what about null??

        const executionRecord = new ExecutionsRecord(webRecordId, executionData.id as number, executionData.isTimed, executionStart);

        let correspondingQ = this.executions.get(webRecordId);

        if (!correspondingQ) {
            correspondingQ = new ExecutionsPriorityQueue();
            this.executions.set(webRecordId, correspondingQ);
        }

        correspondingQ.Push(executionRecord);
    }

}