import * as db2 from '../database/postgress/recordsDatabase'
import CustomDatabaseError from '../Errors/DatabaseErrors/DatabaseError';
import { RecordData } from '../database/interface';
import {CreateRecordDTO, RecordDTO, UpdateRecordDTO} from "./DTOInterface"
import { getAllTagsByRecordId } from "./tagsServices"
import {RecordCreationError, RecordDeletionError} from '../Errors/InternalServerError';

export const getAllRecords = async () => {
   // try {
        const allRecords: RecordData[] = await db2.getAllRecords();

        if(!allRecords)
            return 

        const tagPromises = allRecords.map(record => getAllTagsByRecordId(record.id as number)) || [];
        const recordsTags = await Promise.all(tagPromises);

        const results: RecordDTO[] = allRecords.map((record: RecordData, index) => ({ 
            ...record, tags: recordsTags[index] 
        }));

        return results;
    /*}
    catch(err) { // handle error here
        throw err; // todo:
    }*/
};

export const getRecord = async (recordId: number) => {
   // try {
        const recordData:RecordData = await db2.getRecord(recordId);
        const tagsData = await getAllTagsByRecordId(+recordId);
        const result = { ...recordData, tags: tagsData }
        
        return result;
    /*}
    catch (err) {
        throw err;
    }*/
    
};

export const updateRecord = async (recordData: UpdateRecordDTO) => {
  //  try {

        //if (recordData)
        await db2.updateRecordData(recordData);

    /*}
    catch(err) {
        throw err; // todo: better
    }*/
};

export const createNewRecord = async (data: CreateRecordDTO): Promise<number> => {

    try {   
        const newRecordId = await db2.insertNewRecord(data);
        return newRecordId;
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