import * as db from '../database/hasuraAPI/tagsDatabase'
import * as db2 from '../database/postgress/tagsDatabase'
import {TagRetrievalError, TagCreationError} from '../Errors/InternalServerError'
import {TagCreationConflictError} from '../Errors/ConflictError'
import { TagCreationDTO, TagDTO } from './DTOInterface'
import { TagData } from '../database/interface'
import CustomDatabaseError, {UniqueViolation} from '../Errors/DatabaseErrors/DatabaseError'


export const getAllTags = async (): Promise<TagDTO[]> => {
    try {

        const result:TagData[] = await db2.getAllTags();        
        return result as TagDTO[];

    }
    catch (err) {
        return Promise.reject(new TagRetrievalError(err as Error));
    }
}


export const getAllTagsByRecordId = async (recordId:number): Promise<TagDTO[]> => {
    try {
        const result = await db2.getAllTagsByRecordId(recordId);
        return result as TagDTO[];
    }
    catch (err) {
        return Promise.reject(new TagRetrievalError(recordId));
    }
}


export const createNewTag = async (tagData: TagCreationDTO): Promise<TagDTO> => {
    try {
        const newTagId = await db2.insertOneTag(tagData.name);
        return { name: tagData.name, id: newTagId as number}
    }
    catch (err) {
        if (err instanceof CustomDatabaseError) {
            if (err instanceof UniqueViolation)
                return Promise.reject(new TagCreationConflictError(tagData.name, err.SerializeMessage()));    

            return Promise.reject(new TagCreationError(tagData.name, err.SerializeMessage()));    
        }

        return Promise.reject(new TagCreationError(tagData.name));
    }
}


