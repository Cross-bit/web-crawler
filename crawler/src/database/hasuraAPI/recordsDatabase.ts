import { GetRecordQueryVariables,AllRecordsQuery, UpdateRecordRelationsByRecordIdsMutation, InsertTagsRecordRelationsMutation, InsertRecordMutation, UpdateRecordMutation } from './graphql/generated'
import { Tags_Records_Relations_Insert_Input } from './graphql/generated'
import * as dbInterface from '../interface';
import sdk from "./connection"

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
export const getAllRecords = async () => {

    //const recordsFiltered: AllRecordsQuery = {records: []};
    return sdk.AllRecords();
}

export const getOneRecord = async (id: number) => {

    const params: GetRecordQueryVariables = {
        id: id
    }

    return sdk.GetRecord(params);
}

export const deleteOneRecord = async (id: number) => {
    //we count on cascade on deletation in db
    const params: GetRecordQueryVariables = {
        id: id
    }

    return sdk.DeleteRecord(params);
}

export const insertNewRecord = (recordData: dbInterface.RecordData): Promise<InsertRecordMutation>  => {
    return sdk.InsertRecord(recordData);
}

/*export const insertNewRecordsTagsRelations = async (data: dbInterface.RecordTagsRelationCreation[]): Promise<InsertTagsRecordRelationsMutation>  => {
    try {
       // const result = sdk.InsertTagsRecordRelations({objects: data});
        return result;

    } catch (error) { // todo: error is not returning properly
        throw { status: 500, message: "todo??" || error };
    }
}*/

export const updateRecordData = (recordData: dbInterface.RecordDataPartial): Promise<UpdateRecordMutation> => {

    const recordDataClone = Object.assign({}, recordData);
    delete recordDataClone.id;

    return sdk.UpdateRecord({id: recordData.id, dataToUpdate: recordDataClone });
}

export const UpdateRecordRelations = (relationsToDelete: number[], newTags: dbInterface.RecordTagsRelationCreation[]): Promise<UpdateRecordRelationsByRecordIdsMutation> => {

    const tagsRelations: Tags_Records_Relations_Insert_Input[] = newTags.map((tag)=> ({
        record_id: tag.record_id,
        tag_id: tag.tag_id
    }) );

    return sdk.UpdateRecordRelationsByRecordIds({relationsIdsToDelete: relationsToDelete, objects: tagsRelations});
}