import  {pool} from './connection'
import {DbErrorMessage} from '../../Errors/DatabaseErrors/DatabaseError'
import {ExecutionData} from '../interface';
import { defaultDatabaseErrorHandler } from './utils';
import { createNewExecutionQuery } from './elementaryQueries/executionsQueries';
import { ExcuteTransaction } from './connection';
import { PoolClient } from 'pg';


export const GetAllPlannedExecutions = async (): Promise<ExecutionData[]> => {
    return await ExcuteTransaction(async (client: PoolClient)=> {
      return await 

    }, DbErrorMessage.RetreivalError);
}


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
 