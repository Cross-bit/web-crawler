import { RecordData, ExecutionRecord, RecordDataPartial, TagData} from '../../interface';
import query, { pool } from "../connection"
import { RecordCreationError } from '../../../Errors/InternalServerError';
import { PoolClient } from 'pg';


/**
 * 
 * Elementary queries for records
 * 
*/



/**
 * Inserts new record into database and returns its id
 * @param client pg client object
 * @param data new record data to create
 * @returns 
 */
export const insertNewRecordQuery = async (client: PoolClient, data: RecordDataPartial) => {
    const createRecordQuery = {
        text: 'INSERT INTO records (url, periodicity, label, boundary, active) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        values: [data.url, data.periodicity, data.label, data.boundary, data.active]
    };

    const queryRes = await client.query(createRecordQuery);
        
    if (queryRes.rowCount != 1)
        throw new RecordCreationError(data);
    
    return Promise.resolve(queryRes.rows[0].id);
}

/**
 * Deletes record data from records table
 * @param client 
 * @param recordId Id of record to delete
 * @returns result of the query
 */
export const deleteRecordQuery = async (client: PoolClient, recordId: number) => {
    const queryRemRecord = "DELETE FROM records WHERE id = $1";
    const queryRecordRes = await client.query(queryRemRecord, [recordId]);

    return queryRecordRes;
}

/**
 * Update records data in database
 * @param client 
 * @param data 
 */
export const updateWholeRecordQuery = async (client: PoolClient, data: RecordData) => {
    
    const queryUpdate = {
        text: 'UPDATE records SET url = $1, periodicity = $2, label = $3, boundary = $4, active = $5 WHERE id = $6',
        values: [data.url, data.periodicity, data.label, data.boundary, data.active, data.id]
    };

    const queryUpdateRes = await client.query(queryUpdate);
    return queryUpdateRes;
}

/**
 * Deletes records tags relations from records_tags_relations table
 * @param client 
 * @param recordId Record id to delete tags
 * @returns result of the query
 */
export const deleteRecordTagsRelationQuery = async (client:PoolClient, recordId:number) => {
    const queryRemTagsRelations = "DELETE FROM tags_records_relations WHERE record_id = $1";
    const queryTagsRes = await client.query(queryRemTagsRelations, [recordId]);

    return queryTagsRes;
}


/**
 * Query for insertion of tags record relations to particular racord (by record id).
 * @param client pg client object
 * @param recordId recordId to cre
 * @param tagIds tag ids to insert
 * @returns list of ids of newly inserted tags records relations
 */
export const insertRecordTagsRelationQuery = async (client:PoolClient, recordId: number, tagIds: number[]):Promise<number[]> => {
    
    const createRecordQuery = {
        text: 'INSERT INTO tags_records_relations (tag_id, record_id) VALUES(unnest($1::int[]), $2) RETURNING id',
        values: [tagIds, recordId]
    };
    
    const queryRes = await client.query(createRecordQuery);
    console.log(queryRes);

    return Promise.resolve(queryRes.rows.map(row => row.id));
}


// maybe not needed?
/*export const deleteExecutionByRecordIdQuery = async */