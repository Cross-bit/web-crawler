import  {pool} from './connection'
import {DbErrorMessage} from '../../Errors/DatabaseErrors/DatabaseError'
import {ExecutionData} from '../interface';
import { executionState } from '../../utils/enums';
import { createNewExecutionQuery, getExecutionsQuery } from './elementaryQueries/executionsQueries';
import { ExcuteTransaction } from './connection';
import { PoolClient } from 'pg';


////////////////////////////////
//          GETTERS           //
////////////////////////////////

export const GetAllExecutions = async (): Promise<ExecutionData[]> => {
    return await ExcuteTransaction(async (client: PoolClient)=> {
      return await getExecutionsQuery(client, {isTimed: true, recordId: 6});

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

export const updateExecutionState = async () => {
  const client = await pool.connect();

}

/*export const updateExecutionState = async (client:PoolClient) {

}*/
 