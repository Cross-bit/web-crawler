import { DbErrorMessage } from '../../Errors/DatabaseErrors/DatabaseError'
import * as elq from './elementaryQueries/nodesQueries'
import { ExcuteTransaction } from './connection';
import {ExecutionNodeConnection, 
        ExecutionNode,
        ExecutionNodeWithExeId,
        ExecutionNodeConnectionWithExeId } from '../interface';

import {PoolClient} from 'pg'


export const GetAllNewerNodes = async (recordId: number, nodeId?: number) : Promise<ExecutionNodeWithExeId[]> => 
{
  return await ExcuteTransaction(async (client: PoolClient) => {
    const nodes = await elq.getAllNewerNodes(client, [recordId], nodeId);
    const lastExecutionId = await elq.getLastExecutionIdByRecordId(client, recordId); //TODO: remove the arr ...

    return nodes.map((nodeData): ExecutionNodeWithExeId => ({
        ...nodeData,
        lastExecutionId: lastExecutionId
    })) 

  }, DbErrorMessage.RetreivalError);
}

export const GetAllNewerConnections = async (recordId: number, nodeId?: number) : Promise<ExecutionNodeConnectionWithExeId[]> => {
  return await ExcuteTransaction(async (client: PoolClient) => {
    
    const connections =  await elq.getAllNewerConnections(client, recordId, nodeId);
    const lastExecutionId = await elq.getLastExecutionIdByRecordId(client, recordId);

    return connections.map((edgeData): ExecutionNodeConnectionWithExeId => ({
        ...edgeData,
        lastExecutionId: lastExecutionId
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
