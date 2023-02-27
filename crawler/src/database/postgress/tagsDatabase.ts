import { DatabaseError } from 'pg-protocol';
import { GraphQLClient } from 'graphql-request'

import {CRUDResult, RecordData, RecordDataPartial, TagData} from '../interface'
import CustomDatabaseError, { DbErrorMessage } from '../../Errors/DatabaseErrors/DatabaseError'
import query, { pool } from './connection'

import { AllTagsQuery, getSdk, InsertTagMutationVariables, TagsRecordRelationsByRecordIdQuery, CountOfTagsInListQuery, GetNumberOfTagsQuery } from '../hasuraAPI/graphql/generated'

import {deleteRecordTagsRelationQuery, getAllTagsByRecordIdQuery, getAllTagsQuery, insertNewTag, insertRecordTagsRelationQuery, updateWholeRecordQuery} from "./queries"
import { handleDatabaseError } from './utils';
import { RecordCreationError } from '../../Errors/InternalServerError';

const API_ENDPOINT = process.env.HASURA_ENDPOINT_URL || 'http://hasura:8080/v1/graphql';

const graphQLClient = new GraphQLClient(API_ENDPOINT) // todo: remove
const sdk = getSdk(graphQLClient)


export const insertOneTag = async (tagName: string) => {
    const client = await pool.connect();

    try {
        client.query("BEGIN");
        const newTagId = await insertNewTag(client, tagName);
        client.query("COMMIT");
        
        return newTagId;
    }
    catch (err) {

        client.query("ROLLBACK"); 
        console.log("tady to skončilo");
        console.log(err);

        handleDatabaseError(err as Error, DbErrorMessage.InsertionError);
    }
    finally {
        client.release();
    }
}

export const getAllTags = async () : Promise<TagData[]> => {
    const client = await pool.connect();

    try{
        client.query("BEGIN");

        const result = await getAllTagsQuery(client);

        client.query("COMMIT");

        return result
    }
    catch (err)
    {
        client.query("ROLLBACK"); // todo: fix as it should be

        if (err instanceof DatabaseError && err.code) {
            console.error(err)
            return Promise.reject(new CustomDatabaseError(DbErrorMessage.RetreivalError, err.code, err));
        }
        return Promise.reject(new Error("An error occurred while retrieving tags."));

    }
    finally {
        client.release();
    }
}

export interface RecordTagsRelation {
    record_id: number,
    tag_id: number
}

/**
 * Return all tags related to the record by the record id.
 * @param recordId 
 * @returns Array of TagData
 */
export const getAllTagsByRecordId = async (recordId: number) : Promise<TagData[]> =>
{

    const client = await pool.connect();

    try {
        client.query("BEGIN");

        const result: TagData[] = await getAllTagsByRecordIdQuery(client, recordId);
        
        client.query("COMMIT");

        return result;
    }
    catch (err) {
        client.query("ROLLBACK");
        if (err instanceof DatabaseError && err.code) {
            console.error(err)
            return Promise.reject(new CustomDatabaseError(DbErrorMessage.RetreivalError, err.code, err));
        }
        return Promise.reject(new Error("An error occurred while retrieving tags."));
    }
    finally {
        client.release();
    }
}

export const getAllTagsRecordRelationsByRecordIds = async (recordId: number): Promise<RecordTagsRelation[]> => {
    
    return sdk.TagsRecordRelationsByRecordId({recordId: recordId}).then((data: TagsRecordRelationsByRecordIdQuery) =>
     {
        // todo:
        const dala: RecordTagsRelation[] = [];

        return dala;
     }
    )
}

export const getAllTagsRecordRelationsByRecordId = (recordId: number): Promise<TagsRecordRelationsByRecordIdQuery> => {

    return sdk.TagsRecordRelationsByRecordId({recordId: recordId});
}

export const getCountOfTagsInList = (tagIdsList: number[]) :  Promise<CountOfTagsInListQuery> => {
    return sdk.CountOfTagsInList({_in: tagIdsList});
}


export const getCountOfValuesWithTagName = (tagName: string):  Promise<GetNumberOfTagsQuery> => {
    return sdk.GetNumberOfTags({tagName: tagName});
}