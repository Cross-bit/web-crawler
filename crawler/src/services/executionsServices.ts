import { executionsScheduler } from "./webCrawling/CrawlingServices"
import { ExecutionData, RecordData } from "../database/interface"
import { getRecord } from "../database/postgress/recordsDatabase"
import { CreateExecutionsDTO, ExecutionDTO, ExecutionWithRecordDTO } from "./DTOInterface"
import  * as db from "../database/postgress/executionsDatabase"

// Services for record executions

export const getAllExecutions = async (): Promise<ExecutionDTO[]> => {
    return await db.GetExecutions() as ExecutionDTO[];
}

export const getAllExecutionsByRecordId = async (recordId: number) : Promise<ExecutionDTO[]> => {
    return await db.GetExecutions({recordId: [ recordId ] }) as ExecutionDTO[];
}


export const getAllExecutionsWithRecords = async (): Promise<ExecutionWithRecordDTO[]> => {
    return (await db.GetExecutionsWithRecord()).map(execution => ({
        
    })) as ExecutionWithRecordDTO[];
}

export const updateExecutionAfterRecordChange = async (udpatedRecord: RecordData) => {

    if (udpatedRecord.active) {
       await executionsScheduler.CreateNewExecutionForRecord(udpatedRecord, udpatedRecord.active);
    }
    else {
        await executionsScheduler.CancleTimedExecutionsForRecord(udpatedRecord.id);
    }
}

export const createNewExecution = async (execution: CreateExecutionsDTO) => {
    const recordData = await getRecord(execution.recordId);
    executionsScheduler.CreateNewExecutionForRecord(recordData, execution.isTimed);
}