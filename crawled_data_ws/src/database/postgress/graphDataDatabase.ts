import { DbErrorMessage } from '../../Errors/DatabaseErrors/DatabaseError'
import * as elq from './elementaryQueries/nodesQueries'
import { ExcuteTransaction } from './connection';
import {ExecutionNodeConnection, 
        ExecutionNode,
        ExecutionNodeWithExeId,
        ExecutionNodeConnectionWithExeId, 
        ExecutionNodeWithExecution,
        ExecutionNodeConnectionWithExecution
      } from '../interface';

import {PoolClient} from 'pg'


export const GetAllNewerNodes = async (recordId: number, nodeId?: number) : Promise<ExecutionNodeWithExecution[]> => 
{
  return await ExcuteTransaction(async (client: PoolClient) => {
    const nodes = await elq.getAllNewerNodes(client, [recordId], nodeId);
    //const lastExecutionId = await elq.getLastExecutionIdByRecordId(client, recordId); //TODO: remove the arr ...
    const lastExecution = await elq.getLastDoneExecutionByRecordId(client, recordId);

    if (!lastExecution || !nodes)
      return [];

    return nodes.map((nodeData): ExecutionNodeWithExecution => ({
        ...nodeData,
        lastExecution
    }))

  }, DbErrorMessage.RetreivalError);
}

export const GetAllNewerConnections = async (recordId: number, nodeId?: number) : Promise<ExecutionNodeConnectionWithExecution[]> => {
  return await ExcuteTransaction(async (client: PoolClient) => {
    
    const connections =  await elq.getAllNewerConnections(client, recordId, nodeId);
    //const lastExecutionId = await elq.getLastExecutionIdByRecordId(client, recordId);
    const lastExecution = await elq.getLastDoneExecutionByRecordId(client, recordId);

    if (!lastExecution || !connections)
      return [];

    return connections.map((edgeData): ExecutionNodeConnectionWithExecution => ({
        ...edgeData,
        lastExecution
    }))

  }, DbErrorMessage.RetreivalError);
}

export const GetNodesByRecordIdsQuery = async (recordID: number[]): Promise<ExecutionNode[]> => {
    return await ExcuteTransaction(async (client: PoolClient) => {
      return await elq.getNodesByRecordIdsQuery(client, recordID);
    }, DbErrorMessage.RetreivalError);
}

export const GetAllEdgesByRecordIds = async (recordIDs: number[]): Promise<ExecutionNodeConnection[]> => {
  return await ExcuteTransaction(async (client: PoolClient) => {
    return await elq.getEdgesByRecordIdsQuery(client, recordIDs);
  }, DbErrorMessage.RetreivalError);
}

export const GetNeighbourNodesAll = async (nodeId: number): Promise<ExecutionNodeConnection[]> => {
    return await ExcuteTransaction(async (client: PoolClient) => {
      return await elq.getNodeConnectionsAll(client, nodeId);
    }, DbErrorMessage.RetreivalError);
}

export const GetNeighbourNodesOut = async (nodeId: number): Promise<ExecutionNodeConnection[]> => {
    return await ExcuteTransaction(async (client: PoolClient) => {
      return await elq.getNodeConnectionsOut(client, nodeId);
    }, DbErrorMessage.RetreivalError);
}

export const GetNeighbourNodesIn = async (nodeId: number): Promise<ExecutionNodeConnection[]> => {
    return await ExcuteTransaction(async (client: PoolClient) => {
      return await elq.getNodeConnectionsIn(client, nodeId);
    }, DbErrorMessage.RetreivalError);
}
