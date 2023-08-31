//import { getSdk, GetRecordQueryVariables,AllRecordsQuery, UpdateRecordRelationsByRecordIdsMutation, InsertTagsRecordRelationsMutation, InsertRecordMutation, UpdateRecordMutation } from './graphql/generated'
import { ExecutionData, ExecutionDataWithRecord, ExecutionNode, ExecutionNodeWithErrors, ExecutionsDataFilter, INodesDatabase, RecordData, RecordDataPartial, UpdateExecutionNode } from '../interface';
import {RecordNotFoundError} from '../../Errors/NotFoundError'
import query, { ExcuteTransaction, pool } from "./connection"
import {defaultDatabaseErrorHandler} from "./utils"
import { DbErrorMessage } from '../../Errors/DatabaseErrors/DatabaseError';
import { insertNodeQuery, insertNodeConnectionQuery, getNodesByRecordIdsQuery, insertNodeErrors, updateExecutionNodeQuery, deleteGraphDataNodesByRecordId as deleteGraphDataNodesByRecordId } from  "./elementaryQueries/nodesQueries"
import { PoolClient } from 'pg';
import { getAllExecutionsWithRecords, getExecutionsQuery } from './elementaryQueries/executionsQueries';

////////////////////////////////
//         INSERTIONS         //
////////////////////////////////


export const InsertNewNodesRelation = async (node1Id: number, node2Id: number, recordId: number): Promise<number> => {
  return await ExcuteTransaction(async (client: PoolClient) => {
    return await insertNodeConnectionQuery(client, node1Id, node2Id, recordId);
  }, DbErrorMessage.InsertionError);
}

export const InsertNewNode = async (executionNode: ExecutionNodeWithErrors) =>{
  return await ExcuteTransaction(async (client: PoolClient) => {
    const newNodeId = await insertNodeQuery(client, executionNode);
    const errorsId = await insertNodeErrors(client, newNodeId, executionNode.errors);
    return newNodeId; // todo: return smth better?
  }, DbErrorMessage.InsertionError);
}

////////////////////////////////
//          GETTERS           //
////////////////////////////////

export const GetNodesByRecordIdsQuery = async (recordID: number[]): Promise<ExecutionNodeWithErrors[]> => {
  return await ExcuteTransaction(async (client: PoolClient) => {
    return await getNodesByRecordIdsQuery(client, recordID);
  }, DbErrorMessage.RetreivalError);
}


/*export const GetExecutions = async (filter?: ExecutionsDataFilter): Promise<ExecutionData[]> => {
    return await ExcuteTransaction(async (client: PoolClient) => {
      return await getExecutionsQuery(client, filter);

    }, DbErrorMessage.RetreivalError);
}

export const GetExecutionsWithRecord = async (filter?: ExecutionsDataFilter): Promise<ExecutionDataWithRecord[]> => {
  return await ExcuteTransaction(async (client: PoolClient) => {
      const executions:ExecutionDataWithRecord[] = await getAllExecutionsWithRecords(client, filter);
      return executions;

  }, DbErrorMessage.RetreivalError);
}*/

////////////////////////////////
//          UPDATES           //
////////////////////////////////

export const UpdateNode = async (executionNode: UpdateExecutionNode): Promise<void> => {
  return await ExcuteTransaction(async (client: PoolClient) => {
    return await updateExecutionNodeQuery(client, executionNode);
  }, DbErrorMessage.RetreivalError);
}

////////////////////////////////
//         DELETIONS          //
////////////////////////////////


export const DeleteGraphDataByRecordId = async (recordId: number) =>
{ // this query is called delete graphData since edge data will be deleted aswell
  // due to on cascade settings in the database
  return await ExcuteTransaction(async (client: PoolClient) => {
    return await deleteGraphDataNodesByRecordId(client, recordId);
  }, DbErrorMessage.DeletionError); 
}