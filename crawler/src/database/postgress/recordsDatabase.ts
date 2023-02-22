import { GraphQLClient } from 'graphql-request'
//import { getSdk, GetRecordQueryVariables,AllRecordsQuery, UpdateRecordRelationsByRecordIdsMutation, InsertTagsRecordRelationsMutation, InsertRecordMutation, UpdateRecordMutation } from './graphql/generated'
import * as db_t from '../interface';
import query from "./connection"


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
export const getAllRecords = async () : Promise<db_t.RecordData[]> => {
    try {
        const qeueryRes = await query("SELECT * FROM records");

        //getRecord(1);
        const result = qeueryRes.rows.map((entity) => ({
            id: entity.id,
            url: entity.url,
            periodicity: entity.periodicity,
            label: entity.label,
            boundary: entity.boundary,
            active: true
        }));

        return Promise.resolve(result);
        
    }
    catch (err) {
        console.error(err);
        return Promise.reject(err);
    }

}

export const getRecord = async (recordId: number) : Promise<db_t.RecordData> => {

    try {
        const qeueryRes = await query("SELECT * FROM records WHERE id=$1", [recordId]);

        const queriedRow = qeueryRes.rows[0];
    
        const result = {
            id: queriedRow.id,
            url: queriedRow.url,
            periodicity: queriedRow.periodicity,
            label: queriedRow.label,
            boundary: queriedRow.boundary,
            active: true
        };
        console.log(result)    
        return Promise.resolve(result);
        
    }
    catch (err) {
        console.error(err);
        return Promise.reject(err);
    }
  
}

export const deleteOneRecord = async (id: number) => {
    //we count on cascade on deletation in db
    /*const params: GetRecordQueryVariables = {
        id: id
    }

    return sdk.DeleteRecord(params);*/
}

export const insertNewRecord = (recordData: db_t.RecordData)/*: Promise<InsertRecordMutation> */ => {
    //return sdk.InsertRecord(recordData);
}

export const insertNewRecordsTagsRelations = async (data: db_t.RecordTagsRelationCreation[])/*: Promise<InsertTagsRecordRelationsMutation> */ => {
  /*  try {
        const result = sdk.InsertTagsRecordRelations({objects: data});
        return result;

    } catch (error) { // todo: error is not returning properly
        throw { status: 500, message: "todo??" || error };
    }*/
}

export const updateRecordData = (recordData: db_t.RecordDataPartial)/*: Promise<UpdateRecordMutation>*/ => {

   /* const recordDataClone = Object.assign({}, recordData);
    delete recordDataClone.id;

    return sdk.UpdateRecord({id: recordData.id, dataToUpdate: recordDataClone });*/
}

export const UpdateRecordRelations = (relationsToDelete: number[], newTags: db_t.RecordTagsRelationCreation[])/*: Promise<UpdateRecordRelationsByRecordIdsMutation> */=> {
    
    //return sdk.UpdateRecordRelationsByRecordIds({relationsIdsToDelete: relationsToDelete, objects: newTags});
}