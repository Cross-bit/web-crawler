import { ExecutionData, ExecutionDataWithRecord } from "../../../database/interface";
import { executionState } from "../../../utils/enums";
import ExecutionsScheduler from "./ExecutionScheduling/executionScheduler"
import GraphDataSSEConnections from "../../../services/SSE/GraphDataSSEConnections"


export default class ExecutionStatePublisher
{
    scheduler: ExecutionsScheduler;

    /**
     *
     */
    constructor(scheduler: ExecutionsScheduler) {
        
        this.scheduler = scheduler;
        scheduler.SchedulingStageEmitter.on("ExecutionStateChanged", this.ExecutionStateChanged.bind(this));
    }



    ExecutionStateChanged(executionData: ExecutionDataWithRecord, executionState: executionState) {
        
        // make sure the data are consistant (they should be... but at least the state we want to get right)
        executionData.state = executionState;
        console.log(`exe id: ${executionData.id} new state ${executionState}`);

        const result = {
            id: executionData.id,
            creation: executionData.creation,
            executionStart: executionData.executionStart,
            executionDuration: executionData.executionDuration,
            state: executionData.state,
            isTimed: executionData.isTimed,
            recordId: executionData.record.id
        };
        

        GraphDataSSEConnections.sendDataToClients(result);
        return;
    }


}
