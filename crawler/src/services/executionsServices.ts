import { executionsScheduler } from "./webCrawling/CrawlingServices"
import { ExecutionData } from "../database/interface"
import { insertExecution } from "../database/postgress/executionsDatabase"
import { CreateExecutionsDTO } from "./DTOInterface"
import { executionState } from "../utils/enums"

const createNewTimedExecution = async () => {

}

const createNewImmediateExecution = async () => {

}

export const createNewExecution = async (execution: CreateExecutionsDTO) => {
    try
    {
        const exeData: ExecutionData = {
            creation: execution.creation,
            executionStart: null,
            executionDuration: 0,
            state: executionState.CREATED,
            isTimed: execution.isTimed,
            recordId: execution.recordId
        }

        // create execution in db
        const newExecutionId = await insertExecution(exeData);

        const exeDataComplete = { id: newExecutionId, ...exeData } 
        console.log(exeDataComplete);

        // plan execution timer
          executionsScheduler.SetExecutionWaiting(exeData);
    }
    catch (err) {
        throw err;
    }
}

const planExecution = async (execution: ExecutionData) => {
    try
    {


    }
    catch (err)
    {

    }
}