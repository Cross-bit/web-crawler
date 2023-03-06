import  {pool} from './connection'
import {DbErrorMessage} from '../../Errors/DatabaseErrors/DatabaseError'
import {ExecutionData, ExecutionDataWithRecord, ExecutionsDataFilter} from '../interface';
import { executionState } from '../../utils/enums';
import { createNewExecutionQuery, getAllExecutionsWithRecords, getExecutionsQuery, updateExecutionQuery } from './elementaryQueries/executionsQueries';
import { getRecordByIdQuery, getRecordsByIdsQuery } from './elementaryQueries/recordsQueries';
import { ExcuteTransaction } from './connection';
import { PoolClient } from 'pg';


////////////////////////////////
//          GETTERS           //
////////////////////////////////

export const GetExecutions = async (filter?: ExecutionsDataFilter): Promise<ExecutionData[]> => {
    return await ExcuteTransaction(async (client: PoolClient) => {
      return await getExecutionsQuery(client, filter);

    }, DbErrorMessage.RetreivalError);
}

export const GetExecutionsWithRecord = async (filter?: ExecutionsDataFilter): Promise<ExecutionDataWithRecord[]> => {
  return await ExcuteTransaction(async (client: PoolClient) => {
      const executions:ExecutionDataWithRecord[] = await getAllExecutionsWithRecords(client, filter);
      return executions;

  }, DbErrorMessage.RetreivalError);
}

////////////////////////////////
//         INSERTIONS         //
////////////////////////////////

export const insertExecution = async (execution: ExecutionData) : Promise<number> => {
  return await ExcuteTransaction(async (client:PoolClient) => {

    return await createNewExecutionQuery(client, execution);

  }, DbErrorMessage.InsertionError);
}

////////////////////////////////
//           UPDATES          //
////////////////////////////////



export const UpdateExecutionsState = async (newExecutionState: string, filter: ExecutionsDataFilter): Promise<ExecutionDataWithRecord[]> => {
  return await ExcuteTransaction(async (client: PoolClient) => {
    const updatedIds = await updateExecutionQuery(client, newExecutionState, filter);
    return await getAllExecutionsWithRecords(client, {executionIDs: updatedIds});
  }, DbErrorMessage.UpdateError);
}

/*export const UpdateExecutionState = async (newExecutionState: string, filter: ExecutionsDataFilter) => {
  return await ExcuteTransaction(async (client: PoolClient) => {
    await updateExecutionQuery(client, newExecutionState, filter);
  }, DbErrorMessage.UpdateError);
}*/