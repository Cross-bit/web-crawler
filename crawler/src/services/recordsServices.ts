import * as db from '../database/hasuraAPI/recordsDatabase'
import * as db2 from '../database/postgress/recordsDatabase'
import CustomDatabaseError from '../Errors/DatabaseErrors/DatabaseError';
import { getCountOfTagsInList as getCountOfTagsWithIds, getAllTagsRecordRelationsByRecordId } from '../database/hasuraAPI/tagsDatabase';
import { CRUDResult, RecordData, RecordDataPartial, RecordTagsRelationCreation, TagData } from '../database/interface';
import {CreateRecordDTO, RecordDTO, TagDTO, UpdateRecordDTO} from "./DTOInterface"
import { getAllTagsByRecordId } from "./tagsServices"
import InternalServerError, {RecordCreationError, RecordDeletionError} from '../Errors/InternalServerError';
import { DatabaseError } from 'pg';

export const getAllRecords = async () => {
    try {
        const allRecords: RecordData[] = await db2.getAllRecords();

        if(!allRecords)
            return 

        const tagPromises = allRecords.map(record => getAllTagsByRecordId(record.id as number)) || [];
        const recordsTags = await Promise.all(tagPromises);

        const results: RecordDTO[] = allRecords.map((record: RecordData, index) => ({ 
            ...record, tags: recordsTags[index] 
        }));

        return results;
    }
    catch(err) { // handle error here
        throw err; // todo:
    }
};

export const getRecord = async (recordId: number) => {
    try {

        const recordData:RecordData = await db2.getRecord(recordId);
        const tagsData = await getAllTagsByRecordId(+recordId);
        const result = {...recordData, tags: tagsData}

        return result;
    }
    catch (err) {
        /*if (err instanceof CustomDatabaseError) {
            throw err; // todo: return specific internal error
        }*/ //TODO: do properly
        throw err;
    }
    
};

export const updateRecord = async (recordData: UpdateRecordDTO) => {
    try {
        return await db2.updateRecordData(recordData);
    }
    catch(err) {
        throw err; // todo: better
    }

   /* const recordId = recordData.id || -1;

    /*if (recordId < 0) {
        throw new InternalServerError("Invalid record id provided");
    }*/
    
/*    try {
        /* const vals = await getCountOfTagsWithIds(updatedTags);
        todo: maybe remove this validation??
        if (vals.tags_aggregate.aggregate?.count !== updatedTags.length) {
            throw new Error("Invalid tag ids supplied");
        } */
        
    //    const updatedRecord = await db.updateRecordData(recordData);

    /*   const { tags_records_relations } = await getAllTagsRecordRelationsByRecordId(recordId);
        
        // tags record currently has
        const tagsInDb =  new Set(tags_records_relations.map((recordData) => recordData.tag_id));

        // tags updated
        const tagsAdded: number[] = recordData?.tags?.filter((tagID) => !tagsInDb.has(tagID)) as number[] 
        
        const updatedTagsSet = new Set(recordData?.tags);

        const oldRelationIds: number[] = tags_records_relations
            .filter(relationData => !updatedTagsSet.has(relationData.tag_id))
            .map(relationData => relationData.id);
        
        const recordsTagsData: RecordTagsRelationCreation[] = 
        tagsAdded?.reduce((previous: RecordTagsRelationCreation[], currentTagId: number) => {
            previous.push({
                record_id: recordId,
                tag_id: currentTagId
            });
        
            return previous;
        }, []);
        
        await db.UpdateRecordRelations(oldRelationIds, recordsTagsData);
        
        return { recordId: recordId };

    } catch (error) {
        throw error;
    }*/
};


export const createNewRecord = async (data: CreateRecordDTO) => {

    try {   
        const newRecordId = await db2.insertNewRecord(data);
    }
    catch (err) {
        if (err instanceof CustomDatabaseError) {
            throw new RecordCreationError(data);
        }

        throw err;
    }
};

export const deleteRecord = async (id: number) => {
    try{
        return await db2.deleteRecord(id);
    }
    catch (err) {
        if (err instanceof CustomDatabaseError) {
            throw new RecordDeletionError(id);
        }
        
        throw(err)
    }
};