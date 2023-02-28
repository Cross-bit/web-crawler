import { defaultDatabaseErrorHandler } from "./utils"
import { Pool, PoolClient } from "pg"
import { DbErrorMessage } from "../../Errors/DatabaseErrors/DatabaseError";

// Db connection
export const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: +(process.env.POSTGRES_PORT || 5432),
    max: 20 // TODO: env variable
});


// this signature(defining the type of the query method) allows us to do overloads on it
type QuerySignatures = {
    (query: { text: string; values: any; }): Promise<any>;
    (query: string, params?: any[]): Promise<any>;
  };
  
  const query:QuerySignatures = async (query, params?: any[]) => await pool.query(query, params)
  export default query;



type errorHanlderDelegate<T> = (err: Error, errMessage: string | DbErrorMessage) => T;
type transactionDelegate<T> = (client: PoolClient) => Promise<T>;

/**
 * Execution wrapper for database functions, which ensures atomicity of databse transactions.
 * @param funcTransaction Custom user database operaions to perform
 * @param errorMessage Custom user defined error message
 * @param errorHanlder Custom user defined error handler(if not defined the default handler is invoked)
 */
async function ExcuteTransaction<T>
(
  funcTransaction: transactionDelegate<T>,
  errorMessage?: string | DbErrorMessage,
  errorHanlder?: errorHanlderDelegate<T>
): Promise<T>
{
  const client = await pool.connect();
  try 
  {
      client.query("BEGIN");
      const transactionResult =  await funcTransaction(client);
      client.query("COMMIT");

      return transactionResult;
  }
  catch(err)  
  {
    client.query("ROLLBACK");

    const errMsg = errorMessage ? errorMessage : "Database error occured";

    if (errorHanlder)
      errorHanlder(err as Error, errMsg);
    
    defaultDatabaseErrorHandler(err as Error, errMsg);

    return Promise.reject(err);
  }
  finally
  {
    client.release();
  }
}

export { ExcuteTransaction }