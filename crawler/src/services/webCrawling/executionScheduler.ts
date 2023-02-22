import { GetAllPlannedExecutions } from '../../database/hasuraAPI/executionsDatabase'
import { ExecutionData, RecordDataPartial } from '../../database/interface'
import cron, { ScheduledTask } from 'node-cron';
import ExecutionsRecord from './executionRecord'
import ExecutionsPriorityQueue from './executionsQueue'
import CrawlersPool from './crawlersPool'

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

export default class ExecutionsScheduler {

    executions: Map<number, ExecutionsPriorityQueue> // record id to its executions to be runned

    waitingExecutions: Map<number, ScheduledTask>

    constructor() {
        this.executions = new Map<number, ExecutionsPriorityQueue>();
        this.waitingExecutions = new Map<number, ScheduledTask>();
    }

    /**
     * For Periodicall executions, sets system timer for particular time in the future.
     * @param executionData
     */
    async SetExecutionWaiting(executionData: ExecutionData) {

        if (!executionData.record || !executionData.id || !executionData.isTimed)
            return; // todo: handle error better

        const webRecordId: number = executionData.record.id as number;

        const cronExpression = "";

        const executionTime = executionData.execution_start;

        const cronTask: ScheduledTask = cron.schedule("* * * * *", () => this.PlanExecutionCallback(executionData));

        //cronTask.start();
        //cronTask.stop();


    }

    /**
     * Plans execution to the execution queue.
     * @param executionData
     * @returns
     */
    async PlanExecutionCallback(executionData: ExecutionData)  {

        if (!executionData.record || !executionData.id)
            return; // todo: handle error better

        const webRecordId: number = executionData.record.id as number;

        const executionStart: Date = new Date(executionData.execution_start);

        const executionRecord = new ExecutionsRecord(webRecordId, executionData.id as number, executionData.isTimed, executionStart);

        let correspondingQ = this.executions.get(webRecordId);

        if (!correspondingQ){
            correspondingQ = new ExecutionsPriorityQueue();
            this.executions.set(webRecordId, correspondingQ);
        }

        correspondingQ.Push(executionRecord);
    }

    /**
     * On application start.
     * @returns
     */

    async SynchronizeData() {
        const allPlannedExecutions = await GetAllPlannedExecutions();

        //allPlannedExecutions.executions[0].;
        allPlannedExecutions?.executions.forEach(executionDbData => {

            this.RescheduleExecution({
                    id: executionDbData.id,
                    creation: executionDbData.creation,
                    execution_start: executionDbData.execution_start,
                    execution_time: executionDbData.execution_time,
                    isTimed: executionDbData.execution_time != null,
                    status: executionDbData.execution_status,
                    record: executionDbData.record // todo map correctly...
                });
            });

        return;
    }




    RescheduleExecution(execution: ExecutionData) {

        /*if (execution.isTimed) {
            // plan
        }
        else {

        }*/

        return;
    }
}