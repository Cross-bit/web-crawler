import { ExecutionNodeConnection, ExecutionNode, ExecutionData } from '../../interface';
import { Pool, PoolClient } from 'pg';

/**
 * Returns node connectios that goes out of the node with nodeId
 * @param nodeId 
 */
export const getNodeConnectionsOutQuery = async (client: PoolClient, nodeId:number) => 
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
    }) as ExecutionNodeConnection);
    
    return Promise.resolve(nodeConnections);
}

/**
 * Returns node connectios that goes in to the node with nodeId
 * @param nodeId 
 */
export const getNodeConnectionsInQuery = async (client: PoolClient, nodeId:number) => 
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
    }) as ExecutionNodeConnection);


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

export const getAllNewerNodesQuery = async (client: PoolClient, recordIds: number[], nodeId?: number) : Promise<ExecutionNode[]> =>
{
    let queryText = `SELECT nodes.*,
                     json_agg(node_errors.crawling_code) as errors 
                     FROM nodes 
                     JOIN node_errors ON nodes.id = node_errors.node_id 
                     WHERE record_id = ANY($1)`;

    const values: any[] = [recordIds];

    if (nodeId !== undefined) {
        queryText += ` AND nodes.id > $2`;
        values.push(nodeId);
    }

    queryText += ` GROUP BY nodes.id;`;

    const queryObj = {
        text: queryText,
        values: values
    };

    const queryRes = await client.query(queryObj);

    const result = queryRes.rows.map(queriedRow => ({
        id: queriedRow.id,
        title: queriedRow.title,
        url: queriedRow.url,
        crawlTime: queriedRow.crawl_time,
        recordId: queriedRow.record_id,
        errors: queriedRow.errors
    } as ExecutionNode))

    return Promise.resolve(result);
}

export const getLastDoneExecutionByRecordIdQuery = async (client: PoolClient, recordId: number): Promise<ExecutionData | null> =>  
{

    const queryObj = {
        text: ` SELECT *
                FROM executions
                WHERE record_id = $1
                AND state_of_execution = 'done'
                ORDER BY real_start_time DESC
                LIMIT 1;`,
        values: [recordId]
    }

    const queryRes = await client.query(queryObj);

    if (queryRes.rows.length == 0 )
        return null;

    const queriedData = queryRes.rows[0];

    const result = {
        id: queriedData.id,
        creation: new Date(queriedData.creation_time),
        executionStart: queriedData.start_time ? new Date(queriedData.start_time) : null,
        realExecutionStart: queriedData.real_start_time ? new Date(queriedData.real_start_time) : null,
        executionDuration: queriedData.duration_time,
        sequenceNumber: queriedData.sequence_number,
        state: queriedData.state_of_execution,
        isTimed: queriedData.is_timed,
        recordId: queriedData.record_id
    } as ExecutionData

    return Promise.resolve(result);
}

export const getLastExecutionIdByRecordIdQuery = async (client: PoolClient, recordId: number): Promise<number> =>  
{

    const queryObj = {
        text: ` SELECT id
                FROM executions
                WHERE record_id = $1
                AND state_of_execution = 'done'
                ORDER BY id DESC
                LIMIT 1;`,
        values: [recordId]
    }

    const queryRes = await client.query(queryObj);

    return Promise.resolve(queryRes.rows[0]?.id);
}

export const getAllNewerConnectionsQuery = async (client: PoolClient, recordId: number, edgeId?: number) =>
{
    let queryText = "SELECT * FROM nodes_connections WHERE record_id = $1";

    const values: any[] = [recordId];

    if (edgeId !== undefined) {
        queryText += " AND id > $2";
        values.push(edgeId);
    }

    const queryObj = {
        text: queryText,
        values: values
    };

    const queryRes = await client.query(queryObj);


    const nodeConnections = queryRes.rows.map(row => ({
        id: row.id,
        NodeIdFrom: row.id_from,
        NodeIdTo: row.id_to
    }) as ExecutionNodeConnection);
    

    return Promise.resolve(nodeConnections);
}

export const getEdgesByRecordIdsQuery = async (client: PoolClient, recordIDs: number[]): Promise<ExecutionNodeConnection[]> =>
{
    const queryObj = {
        text: "SELECT * FROM nodes_connections WHERE record_id = ANY($1)",
        values: [recordIDs]
    }

    const queryRes = await client.query(queryObj);

    const nodeConnections = queryRes.rows.map(row => ({
        id: row.id,
        NodeIdFrom: row.id_from,
        NodeIdTo: row.id_to
    }) as ExecutionNodeConnection);
    
    return Promise.resolve(nodeConnections);
}

export const getNodesByRecordIdsQuery = async (client: PoolClient, recordIds: number[]): Promise<ExecutionNode[]> => 
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
    } as ExecutionNode))

    return Promise.resolve(result);
}

/**
 * Returns all nodes connections
 * @param nodeId 
 */
export const getNodeConnectionsAllQuery = async (client: PoolClient, nodeId:number) => 
{
    const queryObj = {
        text: "SELECT * FROM nodes_connections WHERE id_to = $1 OR id_from = $1",
        values: [nodeId]
    }

    const queryRes = await client.query(queryObj);

    const nodeConnections = queryRes.rows.map(row => ({
        id: row.id,
        NodeIdFrom: row.id_to,
        NodeIdTo: row.id_from
    }) as ExecutionNodeConnection);
    
    return Promise.resolve(nodeConnections);
}