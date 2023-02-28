import  {pool} from './connection'
import {DbErrorMessage} from '../../Errors/DatabaseErrors/DatabaseError'
import {ExecutionData} from '../interface';
import { handleDatabaseError } from './utils';



export const GetAllPlannedExecutions = async () => {
  
}


export const insertExecution = async (execution: ExecutionData) => {
  const client = await pool.connect();
  try 
  {
      client.query("BEGIN")

      client.query("COMMIT")


  }
  catch(err) {
    client.query("ROLLBACK")
    handleDatabaseError(err as Error, DbErrorMessage.InsertionError);
  }
  finally
  {
    client.release();
  }
}
 