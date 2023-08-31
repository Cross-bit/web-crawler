import { RecordData, RecordDataPartial, TagData, ExecutionNode, ExecutionNodeConnections, ExecutionData, ExecutionNodeWithErrors, UpdateExecutionNode} from '../../interface';
import query, { pool } from "../connection"
import { RecordCreationError } from '../../../Errors/InternalServerError';
import { Client, PoolClient } from 'pg';
import { RecordNotFoundError } from '../../../Errors/NotFoundError';
import { createEmitAndSemanticDiagnosticsBuilderProgram, isAwaitExpression, nodeModuleNameResolver } from 'typescript';


/*export interface ExecutionNode {
    id?: number
    titile: string
    url: string
    crawlTime: string
    recordId: number
}

export interface ExecutionNodeConnections {
    id?: number
    NodeIdFrom: number
    NodeIdTo: number
}*/


/**
 * Returns node connectios that goes out of the node
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
        NodeIdTo: row.node_to,
        recordId: row.record_id,
    }) as ExecutionNodeConnections);
    
    return Promise.resolve(nodeConnections);
}

/**
 * Returns node connectios that goes in to the node
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
        NodeIdTo: row.node_to,
        recordId: row.record_id,
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


/*export const deleteNodesDataByRecordId = (recordID: ) =>{
    let queryStr // TODO:!!
}*/

export const updateExecutionNodeQuery = async (client: PoolClient, executionNode: UpdateExecutionNode) =>{
    let queryStr = "UPDATE executions SET ";
    const queryValues = [];

    const updateQueryParts = [];    

    if (executionNode.crawlTime) {
        queryValues.push(executionNode.crawlTime);
        updateQueryParts.push(`crawl_time = $${queryValues.length}`);
    }

    if (executionNode.title) {
        queryValues.push(executionNode.title);
        updateQueryParts.push(`crawl_time = $${queryValues.length}`);
    }

    if (queryValues.length == 0)
        return; // nothing to update


    const udpateQueryStr:string = updateQueryParts.join(", ");
    queryStr += udpateQueryStr;

    queryValues.push(executionNode.id);
    queryStr += `WHERE id = $${queryValues.length}`

    const queryObj = { text: queryStr + udpateQueryStr,
                    values: queryValues }

    const queryRes = await client.query(queryObj);

    // todo return bool etc.
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
        NodeIdTo: row.node_to,
        recordId: row.record_id,
    }) as ExecutionNodeConnections);
    
    return Promise.resolve(nodeConnections);
}

export const insertNodeQuery = async (client:PoolClient, newNode: ExecutionNode): Promise<number> => {
    const queryObj = {
            text: `INSERT INTO nodes (title, url, crawl_time, record_id) 
            VALUES ($1, $2, $3, $4) RETURNING id`,
            values: [newNode.title, newNode.url, newNode.crawlTime, newNode.recordId]
        }

    const queryRes = await client.query(queryObj);
        //console.log(queryRes);
    return  Promise.resolve(queryRes.rows[0].id);
}  

export const insertNodeErrors = async (client:PoolClient, nodeId: number, errors: string[]) => {
    const queryObj = {
            text: `INSERT INTO node_errors (node_id, crawling_code) 
            VALUES ($1, unnest($2::crawlingStatus[])) RETURNING id`,
            values: [nodeId, errors]
        } // crawlingStatus type is custom enum type

    const queryRes = await client.query(queryObj);

    return  Promise.resolve(queryRes.rows[0].id);
}  


export const insertNodeConnectionQuery = async (client: PoolClient, nodeId1: number, nodeId2: number, recordId: number) => {
    const queryObj = {
        text: `INSERT INTO nodes_connections (id_from, id_to, record_id) 
        VALUES ($1, $2, $3) RETURNING id`,
        values: [nodeId1, nodeId2, recordId]
    }

    const queryRes = await client.query(queryObj);
    return Promise.resolve(queryRes.rows[0].id);
}

export const deleteGraphDataNodesByRecordId = async (client: PoolClient, recordId: number) =>{
    const queryObj = {
        text: `DELETE FROM nodes WHERE record_id = $1`,
        values: [recordId]
    }
    
    await client.query(queryObj);
}