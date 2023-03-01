import {ExecutionData, GetExecutionsDataFilter, IExecutionsDatabase} from "../interface"
import * as executionDatabase from "./executionsDatabase"

export class ExecutionDatabaseWrapper implements IExecutionsDatabase
{
  
  async GetExecutions (filter?: GetExecutionsDataFilter): Promise<ExecutionData[]>{
    return await executionDatabase.GetExecutions(filter);
  }
  
  async insertExecution(execution: ExecutionData): Promise<number>{ 
    return await executionDatabase.insertExecution(execution);
  }
}
