import  {pool} from './connection'
import {DbErrorMessage} from '../../Errors/DatabaseErrors/DatabaseError'
import {ExecutionData} from '../interface';
import { defaultDatabaseErrorHandler } from './utils';
import { createNewExecutionQuery } from './elementaryQueries/executionsQueries';
import { PoolClient } from 'pg';


export const GetAllPlannedExecutions = async () => {
  
}


export const insertExecution = async (execution: ExecutionData) => {
  const client = await pool.connect();
  try 
  {
      client.query("BEGIN")
      createNewExecutionQuery(client, execution);
      client.query("COMMIT")
  }
  catch(err) {
    client.query("ROLLBACK")
    defaultDatabaseErrorHandler(err as Error, DbErrorMessage.InsertionError);
  }
  finally
  {
    client.release();
  }
}

export const updateExecutionState = async () => {
  const client = await pool.connect();


}

/*export const updateExecutionState = async (client:PoolClient) {

}*/
 