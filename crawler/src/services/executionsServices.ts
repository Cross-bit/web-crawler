import { executionsScheduler } from "./webCrawling/CrawlingServices"
import { ExecutionData, ExecutionDataWithRecord, ExecutionsDataFilter, RecordData } from "../database/interface"
import { insertExecution, UpdateExecutionsState } from "../database/postgress/executionsDatabase"
import { getRecord } from "../database/postgress/recordsDatabase"
import { CreateExecutionsDTO, ExecutionDTO, ExecutionWithRecordDTO } from "./DTOInterface"
import  * as db from "../database/postgress/executionsDatabase"
import { executionState } from "../utils/enums"

// Services for record executions

export const getAllExecutions = async (): Promise<ExecutionDTO[]> => {
    try{
        return await db.GetExecutions() as ExecutionDTO[];
    }
    catch (err) {
        throw err;
    }
}

export const getAllExecutionsByRecordId = async (recordId: number) : Promise<ExecutionDTO[]> => {
    return await db.GetExecutions({recordId: [ recordId ] }) as ExecutionDTO[];
}

/*export const getLastExecutionByRecordId = async (recordId: number) : Promise<ExecutionDTO[]> => {
    return await db.GetExecutions({recordId: [ recordId ] }) as ExecutionDTO[];
}*/


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

export const updateExecutionAfterRecordChange = (udpatedRecord: RecordData) => {
    if (udpatedRecord.active) {
        executionsScheduler.CreateNewExecutionForRecord(udpatedRecord, udpatedRecord.active);
    }
    else {
        executionsScheduler.CancleTimedExecutionsForRecord(udpatedRecord.id);
    }
}

export const createNewExecution = async (execution: CreateExecutionsDTO) => {
    try {
        const recordData = await getRecord(execution.recordId);
        executionsScheduler.CreateNewExecutionForRecord(recordData, execution.isTimed);
        
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