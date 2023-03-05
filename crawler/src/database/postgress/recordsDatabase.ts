//import { getSdk, GetRecordQueryVariables,AllRecordsQuery, UpdateRecordRelationsByRecordIdsMutation, InsertTagsRecordRelationsMutation, InsertRecordMutation, UpdateRecordMutation } from './graphql/generated'
import { RecordData, RecordDataPartial } from '../interface';
import {RecordNotFoundError} from '../../Errors/NotFoundError'
import query, { ExcuteTransaction, pool } from "./connection"
import {defaultDatabaseErrorHandler} from "./utils"
import { DbErrorMessage } from '../../Errors/DatabaseErrors/DatabaseError';
import { deleteRecordTagsRelationQuery, insertRecordTagsRelationQuery, deleteRecordQuery, updateWholeRecordQuery, insertNewRecordQuery, getRecordByIdQuery, getAllRecordsQuery } from  "./elementaryQueries/recordsQueries"
import { PoolClient } from 'pg';


////////////////////////////////
//          GETTERS           //
////////////////////////////////

/**
 * @openapi
 * components:
 *   schemas:
 *     Record:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         url:
 *           type: string
 *           example: http://www.example.com
 *         boundary:
 *           type: string
 *           example: /example.com/
 *         periodicity:
 *           type: number
 *           example: 60
 *         label:
 *           type: string
 *           example: Example
 *         active:
 *           type: bool
 *           example: true
 */
export const getAllRecords = async () : Promise<RecordData[]> => {

    return await ExcuteTransaction(async (client: PoolClient) => {
        
        return await getAllRecordsQuery(client);

    }, DbErrorMessage.RetreivalError);
}

export const getRecord = async (recordId: number) : Promise<RecordData> => {
    return await ExcuteTransaction<RecordData>(async (client:PoolClient) => {

        const qeueryRes = await getRecordByIdQuery(client, recordId);
        return qeueryRes;

    }, DbErrorMessage.RetreivalError)
}

////////////////////////////////
//         INSERTIONS         //
////////////////////////////////

/**
 * Inserts new record into the database. Returns newly created records id.  
 * @param data 
 * @returns Newly created records id(if success). 
 */
export const insertNewRecord = async (data: RecordDataPartial): Promise<number> => {

    return await ExcuteTransaction<number>(async (client:PoolClient) => {
        // TODO: return also tags relation ids??
        
        const newRecordId = await insertNewRecordQuery(client, data);
        const newRecordTags = await insertRecordTagsRelationQuery(client, newRecordId, data.tags as number[]);
        return newRecordId;

    }, DbErrorMessage.InsertionError)
}


export const insertNewRecordsTagsRelations = async (recordId: number, tagIds: number[]): Promise<void>  => {
    return await ExcuteTransaction(async (client: PoolClient) => {
        const newRecordId = await insertRecordTagsRelationQuery(client, recordId, tagIds);
    }, DbErrorMessage.InsertionError)
}


////////////////////////////////
//         DELETIONS          //
////////////////////////////////

export const deleteRecord = async (recordId: number): Promise<void> => {
    return await ExcuteTransaction(async (client: PoolClient) => {
        const queryRecordRes = await deleteRecordQuery(client, recordId)
        // btw this is probably not necessary because of the cascade way of db... TODO:
        const queryTagsRes = await deleteRecordTagsRelationQuery(client, recordId);
    }, DbErrorMessage.DeletionError)
}

////////////////////////////////
//          UPDATES           //
////////////////////////////////


export const updateRecordData = async (recordData: RecordDataPartial): Promise<void> => {
    return await ExcuteTransaction(async (client: PoolClient) => {
        const updateRecordRes = await updateWholeRecordQuery(client, recordData as RecordData); // TODO: redesign the interface
        const deletionQueryRes = await deleteRecordTagsRelationQuery(client, recordData.id as number);
        const tagInsertionQueryRes =  await insertRecordTagsRelationQuery(client, recordData.id as number, recordData.tags as number[]);
    }, DbErrorMessage.UpdateError)
}