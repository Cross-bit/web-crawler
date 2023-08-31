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

        const result: ExecutionData = {...executionData, recordId: executionData.record.id};
        
        console.log(result);

        GraphDataSSEConnections.sendDataToClients(result);
        return;
    }


}
