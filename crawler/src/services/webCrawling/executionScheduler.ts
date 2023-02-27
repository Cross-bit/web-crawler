import { GetAllPlannedExecutions } from '../../database/hasuraAPI/executionsDatabase'
import { ExecutionData, RecordDataPartial } from '../../database/interface'
import cron, { ScheduledTask } from 'node-cron';
import ExecutionsRecord from './executionRecord'
import ExecutionsPriorityQueue from './executionsQueue'
import CrawlersPool from './crawlersPool'
import IExecutionsScheduler from  './interface'

export class ExecutionExecutor {

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
}



export default class ExecutionsScheduler implements IExecutionsScheduler
{

    executions: Map<number, ExecutionsPriorityQueue> // record id to its executions to be runned

    /**
     * Contains executions that are supposed to be planned 
     */
    cronPlannedExecutions: Map<number, ScheduledTask>

    constructor() {
        this.executions = new Map<number, ExecutionsPriorityQueue>();
        this.cronPlannedExecutions = new Map<number, ScheduledTask>();
    }

    /**
     * For Periodicall executions, sets system timer for particular time in the future.
     * @param executionData
     */
    public async SetExecutionWaiting(executionData: ExecutionData) {

        if (!executionData.record || !executionData.id || !executionData.isTimed)
            return; // todo: handle error better

        const webRecordId: number = executionData.record.id as number;

        const cronExpression = "";

        const executionTime = executionData.executionStart;

        const cronTask: ScheduledTask = cron.schedule("* * * * *", () => this.PlanExecutionCallback(executionData));
    }

    /**
     * On application start.
     * @returns
    */
    public async SynchronizeData() {
        const allPlannedExecutions = await GetAllPlannedExecutions();

        //allPlannedExecutions.executions[0].;
        allPlannedExecutions?.executions.forEach(executionDbData => {

            this.RescheduleExecution({
                    id: executionDbData.id,
                    creation: executionDbData.creation,
                    executionStart: executionDbData.execution_start,
                    executionTime: executionDbData.execution_time,
                    isTimed: executionDbData.execution_time != null,
                    status: executionDbData.execution_status,
                    record: executionDbData.record // todo map correctly...
                });
            });

        return;
    }

    public RescheduleExecution(execution: ExecutionData) {

        /*if (execution.isTimed) {
            // plan TODO:
        }
        else {

        }*/

        return;
    }

    /**
     * Plans execution to the execution queue.
     * @param executionData
     * @returns
     */
    private async PlanExecutionCallback(executionData: ExecutionData)  {

        if (!executionData.record || !executionData.id)
            return; // todo: handle error better

        const webRecordId: number = executionData.record.id as number;

        const executionStart: Date = new Date(executionData.executionStart);

        const executionRecord = new ExecutionsRecord(webRecordId, executionData.id as number, executionData.isTimed, executionStart);

        let correspondingQ = this.executions.get(webRecordId);

        if (!correspondingQ){
            correspondingQ = new ExecutionsPriorityQueue();
            this.executions.set(webRecordId, correspondingQ);
        }

        correspondingQ.Push(executionRecord);
    }

}