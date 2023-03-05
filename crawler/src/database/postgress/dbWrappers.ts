import * as dbInterface from "../interface"
import * as executionDatabase from "./executionsDatabase"
import * as recordsDatabase from "./recordsDatabase"



/**/
export class DatabaseWrapper implements dbInterface.IDatabaseWrapper
{
  public ExecutionDatabase?: dbInterface.IExecutionsDatabase;
  public RecordsDatabase?: dbInterface.IRecordsDatabase;
  public TagsDatabase?: dbInterface.ITagsDatabase;

  constructor(
    executionDb?: dbInterface.IExecutionsDatabase,
    recordsDb?: dbInterface.IRecordsDatabase,
    tagsDb?: dbInterface.ITagsDatabase
  ) {
      this.ExecutionDatabase = executionDb
      this.RecordsDatabase = recordsDb;
      this.TagsDatabase = tagsDb
  }
}

export class ExecutionDatabaseWrapper implements dbInterface.IExecutionsDatabase
{
  
  async GetExecutions (filter?: dbInterface.ExecutionsDataFilter): Promise<dbInterface.ExecutionData[]>{
    return await executionDatabase.GetExecutions(filter);
  }
  async GetExecutionsWithRecord (filter?: dbInterface.ExecutionsDataFilter): Promise<dbInterface.ExecutionDataWithRecord[]>{
    return await executionDatabase.GetExecutionsWithRecord(filter);
  }
  async insertExecution(execution: dbInterface.ExecutionData): Promise<number>{ 
    return await executionDatabase.insertExecution(execution);
  }
  /*async UpdateExecutionState (newExecutionState: string, filter: dbInterface.ExecutionsDataFilter): Promise<void> {
    return await executionDatabase.UpdateExecutionState(newExecutionState, filter);
  }*/
  async UpdateExecutionsState(newExecutionState: string, filter: dbInterface.ExecutionsDataFilter): Promise<dbInterface.ExecutionDataWithRecord[]> {
    return await executionDatabase.UpdateExecutionsState(newExecutionState, filter);
  }
}


export class RecordsDatabaseWrapper implements dbInterface.IRecordsDatabase
{
  async GetRecord(recordId: number): Promise<dbInterface.RecordData> {
    return await recordsDatabase.getRecord(recordId);
  }
  async GetAllRecords(): Promise<dbInterface.RecordData[]> {
    return await recordsDatabase.getAllRecords();
  }
  async DeleteRecord(recordId: number): Promise<void> {
    return await recordsDatabase.deleteRecord(recordId);
  }
  async InsertNewRecord(data: dbInterface.RecordDataPartial): Promise<number> {
    return await recordsDatabase.insertNewRecord(data);
  }
  async InsertNewRecordsTagsRelations(recordId: number, tagIds: number[]): Promise<void> {
    return await recordsDatabase.insertNewRecordsTagsRelations(recordId, tagIds);
  }
  async UpdateRecordData(recordData: dbInterface.RecordDataPartial): Promise<void> {
    return await recordsDatabase.updateRecordData(recordData);
  }
  
}


// TODO: tags wrapper if needed??