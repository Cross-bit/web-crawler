
export enum ExecutionPlanningState {
    Planned = "planned",
    Running = "running", //executions are
}

export class ExecutionsRecord {

    recordID: number
    executionID: number
    executionState: ExecutionPlanningState
    isTimed: boolean

    constructor(recordId: number, executionId: number, isTimed: boolean){
        this.recordID = recordId;
        this.executionID = executionId;
        this.executionState = ExecutionPlanningState.Planned;
        this.isTimed = isTimed;
    }
}

export default class ExecutionsQueue {

    executions: ExecutionsRecord[]

    constructor() {
        this.executions = []
    }

    SynchronizeData(): void {


        return;
    }

    PlanExecution(): void {
        return;
    }
}