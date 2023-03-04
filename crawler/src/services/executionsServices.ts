import { executionsScheduler } from "./webCrawling/CrawlingServices"
import { ExecutionData, ExecutionDataWithRecord } from "../database/interface"
import { insertExecution } from "../database/postgress/executionsDatabase"
import { getRecord } from "../database/postgress/recordsDatabase"
import { CreateExecutionsDTO, ExecutionDTO, ExecutionWithRecordDTO } from "./DTOInterface"
import  * as db from "../database/postgress/executionsDatabase"
import { executionState } from "../utils/enums"


export const getAllExecutions = async (): Promise<ExecutionDTO[]> => {
    try{
        return await db.GetExecutions() as ExecutionDTO[];
    }
    catch (err) {
        throw err;
    }
}


// TODO: do i really need it?
export const getAllExecutionsWithRecords = async (): Promise<ExecutionWithRecordDTO[]> => {
    try{
        return (await db.GetExecutionsWithRecord()).map(execution => ({
            
        })) as ExecutionWithRecordDTO[];
    }
    catch (err) {
        throw err;
    }
}


export const createNewExecution = async (execution: CreateExecutionsDTO) => {
    try
    {

        const recordData = await getRecord(execution.recordId);

        const exeData: ExecutionDataWithRecord = {
            creation: execution.creation,
            executionStart: null,
            executionDuration: 0,
            state: executionState.CREATED,
            isTimed: execution.isTimed,
            record: recordData
        }
        
        // set official start time 
        exeData.executionStart = new Date(executionsScheduler.GetDateTimeOfNextExecution(exeData));

        // create execution in db
        const newExecutionId = await insertExecution({...exeData, recordId: execution.recordId} as ExecutionData);

        // TODO: find a way to delete recordId from original object...
        exeData.id = newExecutionId;

        console.log(exeData);

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