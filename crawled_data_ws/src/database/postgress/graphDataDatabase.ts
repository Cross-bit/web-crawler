import { DbErrorMessage } from '../../Errors/DatabaseErrors/DatabaseError'
import { getNodesByRecordIdsQuery, getNodeConnectionsOut, getNodeConnectionsIn, getNodeConnectionsAll } from './elementaryQueries/nodesQueries'
import { ExcuteTransaction } from './connections';
import { ExecutionNode, ExecutionNodeConnections, ExecutionNodeWithErrors } from '../interface';
import {PoolClient} from 'pg'


export const GetNodesByExecutionIdsQuery = async (recordID: number[]): Promise<ExecutionNodeWithErrors[]> => {
    return await ExcuteTransaction(async (client: PoolClient) => {
      return await getNodesByRecordIdsQuery(client, recordID);
    }, DbErrorMessage.RetreivalError);
}

export const GetNeighbourNodesAll = async (nodeId: number): Promise<ExecutionNodeConnections[]> => {
    return await ExcuteTransaction(async (client: PoolClient) => {
      return await getNodeConnectionsAll(client, nodeId);
    }, DbErrorMessage.RetreivalError);
}

export const GetNeighbourNodesOut = async (nodeId: number): Promise<ExecutionNodeConnections[]> => {
    return await ExcuteTransaction(async (client: PoolClient) => {
      return await getNodeConnectionsOut(client, nodeId);
    }, DbErrorMessage.RetreivalError);
}

export const GetNeighbourNodesIn = async (nodeId: number): Promise<ExecutionNodeConnections[]> => {
    return await ExcuteTransaction(async (client: PoolClient) => {
      return await getNodeConnectionsIn(client, nodeId);
    }, DbErrorMessage.RetreivalError);
}
