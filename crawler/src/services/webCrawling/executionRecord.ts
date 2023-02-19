
/*export enum ExecutionPlanningState {
    Planned = "planned",
    Running = "running", //executions are
}*/

export default class ExecutionsRecord {

    recordID: number
    executionID: number
    TimeToExecute: Date | undefined
    IsTimed: boolean

    constructor(recordId: number, executionId: number, isTimed: boolean, executionTime: Date | undefined) {
        this.recordID = recordId;
        this.executionID = executionId;
        this.TimeToExecute = executionTime;
    //    this.executionState = ExecutionPlanningState.Planned;
        this.IsTimed = isTimed;
    }
}