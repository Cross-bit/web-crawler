import { ExecutionNodeConnections, ExecutionNodeWithErrors } from '../../interface';
import { PoolClient } from 'pg';

/**
 * Returns node connectios that goes out of the node with nodeId
 * @param nodeId 
 */
export const getNodeConnectionsOut = async (client: PoolClient, nodeId:number) => 
{
    const queryObj = {
        text: "SELECT * FROM nodes_connections WHERE id_from = $1",
        value: [nodeId]
    }

    const queryRes = await client.query(queryObj);

    const nodeConnections = queryRes.rows.map(row => ({
        id: row.id,
        NodeIdFrom: row.node_from,
        NodeIdTo: row.node_to
    }) as ExecutionNodeConnections);
    
    return Promise.resolve(nodeConnections);
}

/**
 * Returns node connectios that goes in to the node with nodeId
 * @param nodeId 
 */
export const getNodeConnectionsIn = async (client: PoolClient, nodeId:number) => 
{
    const queryObj = {
        text: "SELECT * FROM nodes_connections WHERE id_to = $1",
        value: [nodeId]
    }

    const queryRes = await client.query(queryObj);

    const nodeConnections = queryRes.rows.map(row => ({
        id: row.id,
        NodeIdFrom: row.node_from,
        NodeIdTo: row.node_to
    }) as ExecutionNodeConnections);


    return Promise.resolve(nodeConnections);
}

export const getErrorsQuery = async (client: PoolClient, nodeIds: number[]) => {
    const queryObj = {
        text: `SELECT id, crawling_code FROM node_errors WHERE node_id = ANY($1)`,
        values: [nodeIds]
    }

    const queryRes = await client.query(queryObj);

    return Promise.resolve(queryRes.rows);
}

export const getNodesByRecordIdsQuery = async (client: PoolClient, recordIds: number[]): Promise<ExecutionNodeWithErrors[]> => 
{
    const queryObj = {
        text: `SELECT nodes.*, 
                json_agg(node_errors.crawling_code) as errors 
                FROM nodes 
                JOIN node_errors ON nodes.id = node_errors.node_id 
                WHERE record_id = ANY($1)
                GROUP BY nodes.id;`,
        values: [recordIds]
    }

    const queryRes = await client.query(queryObj);

    const result = queryRes.rows.map(queriedRow => ({
        id: queriedRow.id,
        title: queriedRow.title,
        url: queriedRow.url,
        crawlTime: queriedRow.crawl_time,
        recordId: queriedRow.record_id,
        errors: queriedRow.errors
    } as ExecutionNodeWithErrors))

    return Promise.resolve(result);
}

/**
 * Returns all nodes connections
 * @param nodeId 
 */
export const getNodeConnectionsAll = async (client: PoolClient, nodeId:number) => 
{
    const queryObj = {
        text: "SELECT * FROM nodes_connections WHERE id_to = $1 OR id_from = $1",
        values: [nodeId]
    }

    const queryRes = await client.query(queryObj);

    const nodeConnections = queryRes.rows.map(row => ({
        id: row.id,
        NodeIdFrom: row.node_from,
        NodeIdTo: row.node_to
    }) as ExecutionNodeConnections);
    
    return Promise.resolve(nodeConnections);
}