import * as dbInterface from "../interface"
import { ExecutionNode } from "../interface";
import * as executionDatabase from "./executionsDatabase"
import * as nodesDatabase from "./nodesDatabase";
import * as recordsDatabase from "./recordsDatabase"

/**/
export class DatabaseWrapper implements dbInterface.IDatabaseWrapper
{
  public ExecutionDatabase?: dbInterface.IExecutionsDatabase;
  public RecordsDatabase?: dbInterface.IRecordsDatabase;
  public TagsDatabase?: dbInterface.ITagsDatabase;
  public NodesDatabase?: dbInterface.INodesDatabase;

  constructor(
    executionDb?: dbInterface.IExecutionsDatabase,
    recordsDb?: dbInterface.IRecordsDatabase,
    nodesDb?: dbInterface.INodesDatabase,
    tagsDb?: dbInterface.ITagsDatabase
  ) {
      this.ExecutionDatabase = executionDb
      this.RecordsDatabase = recordsDb;
      this.NodesDatabase = nodesDb;
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
  async UpdateExecutionsDuration(newExecutionDuration: number, filter: dbInterface.ExecutionsDataFilter): Promise<number[]> {
    return await executionDatabase.UpdateExecutionsDuration(newExecutionDuration, filter);
  }
  async UpdateExecutionsStartTime(realStartTime: Date, executionId: number): Promise<void> {
    return await executionDatabase.UpdateExecutionsRealStartTime(realStartTime, executionId);
  }
  async UpdateExecutionOnExecutionStart(realStartTime: Date, executionId: number): Promise<void> {
    return await executionDatabase.UpdateExecutionOnExecutionStart(realStartTime, executionId); 
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
  async GetAllRecordsByIds(recordIDs: number[]): Promise<dbInterface.RecordData[]> {
    return await recordsDatabase.getAllRecordsByIDs(recordIDs);
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

export class NodesDatabaseWrapper implements dbInterface.INodesDatabase
{  
  async InsertNewNode(nodeData: dbInterface.ExecutionNodeWithErrors): Promise<number> {
    return await nodesDatabase.InsertNewNode(nodeData);
  }
  async InsertNewNodesRelation(node1Id: number, node2Id: number, recordId: number): Promise<number> {
    return await nodesDatabase.InsertNewNodesRelation(node1Id, node2Id, recordId);
  }
  async GetNodesByRecordIdsQuery(recordId: number[]): Promise<dbInterface.ExecutionNodeWithErrors[]> {
    return await nodesDatabase.GetNodesByRecordIdsQuery(recordId);
  }
  async UpdateNodesQuery(dataToUpdate: dbInterface.UpdateExecutionNode): Promise<void> {
    return await nodesDatabase.UpdateNode(dataToUpdate);
  }
  async DeleteAllGraphDataByRecordId(recordId: number): Promise<void> {
    return await nodesDatabase.DeleteGraphDataByRecordId(recordId);
  }
}




// TODO: tags wrapper if needed??