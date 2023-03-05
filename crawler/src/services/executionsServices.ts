import { executionsScheduler } from "./webCrawling/CrawlingServices"
import { ExecutionData, ExecutionDataWithRecord, ExecutionsDataFilter } from "../database/interface"
import { insertExecution, UpdateExecutionsState } from "../database/postgress/executionsDatabase"
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
    try {
        const recordData = await getRecord(execution.recordId);
        executionsScheduler.CreateNewExecutionForRecord(recordData, execution.isTimed)
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