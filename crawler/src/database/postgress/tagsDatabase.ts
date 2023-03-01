import { DatabaseError } from 'pg-protocol';
import { GraphQLClient } from 'graphql-request'
import {TagData} from '../interface'
import CustomDatabaseError, { DbErrorMessage } from '../../Errors/DatabaseErrors/DatabaseError'
import { ExcuteTransaction, pool } from './connection'
import {getAllTagsByRecordIdQuery, getAllTagsQuery, insertNewTag} from "./elementaryQueries/tagsQueries"
import { defaultDatabaseErrorHandler } from './utils';
import { PoolClient } from 'pg';


////////////////////////////////
//         INSERTIONS         //
////////////////////////////////

export const insertOneTag = async (tagName: string) => {

    return await ExcuteTransaction(async (client: PoolClient) => {
        const newTagId = await insertNewTag(client, tagName);
        return newTagId;
    }, DbErrorMessage.InsertionError);
}

////////////////////////////////
//          GETTERS           //
////////////////////////////////

export const getAllTags = async () : Promise<TagData[]> => {

    return await ExcuteTransaction(async (client: PoolClient) => {
        const result = await getAllTagsQuery(client);
        return result
    }, DbErrorMessage.RetreivalError);
}


/**
 * Return all tags related to the record by the record id.
 * @param recordId 
 * @returns Array of TagData
 */
export const getAllTagsByRecordId = async (recordId: number) : Promise<TagData[]> =>
{
    return await ExcuteTransaction(async (client: PoolClient) => {
        const result: TagData[] = await getAllTagsByRecordIdQuery(client, recordId);
        return result;
    }, DbErrorMessage.RetreivalError)
}