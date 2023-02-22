import * as db from '../database/hasuraAPI/recordsDatabase'
import * as db2 from '../database/postgress/recordsDatabase'
import { getCountOfTagsInList as getCountOfTagsWithIds, getAllTagsRecordRelationsByRecordId } from '../database/hasuraAPI/tagsDatabase';
import { RecordData, RecordDataPartial, RecordTagsRelationCreation } from '../database/interface';


export const getAllRecords = async () => {
    return await db2.getAllRecords(); // todo: handle errors
};

export const getRecord = async (id: number): Promise<RecordData> => {
    return await db2.getRecord(id); // todo: handle errors
};

export const updateRecord = async (recordData: RecordDataPartial, updatedTags: number[]) => {

    const recordId = recordData.id || -1;

    if (recordId < 0) {
        throw new Error("Internal server error.");
    }
    
    try {
        /* const vals = await getCountOfTagsWithIds(updatedTags);
        todo: maybe remove this validation??
        if (vals.tags_aggregate.aggregate?.count !== updatedTags.length) {
            throw new Error("Invalid tag ids supplied");
        } */
        
        const updatedRecord = await db.updateRecordData(recordData);

        const { tags_records_relations } = await getAllTagsRecordRelationsByRecordId(recordId);
        
        // tags record currently has
        const tagsInDb =  new Set(tags_records_relations.map((recordData) => recordData.tag_id));

        // tags updated
        const tagsAdded: number[] = updatedTags.filter((tagID) => !tagsInDb.has(tagID))
        
        const updatedTagsSet = new Set(updatedTags);

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
    }
};

export const createNewRecord = async (data: RecordData, tags: number[]) => {

    const responseObj = { recordId: 0 };

    return getCountOfTagsWithIds(tags).then((vals)=>{

        // check if all tags are valid
        if (vals.tags_aggregate.aggregate?.count != tags.length) {
            throw new Error("Invalid tag ids supplied"); // todo: not returned properly
        }

        return db.insertNewRecord(data);
    }).then((insertedRecord) => {

        const { insert_records_one }  = insertedRecord;
        const recordId = insert_records_one?.id ?? -1;

        responseObj.recordId = recordId;

        // todo: fix DRY
        const recordsTagsData = tags?.reduce((previous: RecordTagsRelationCreation[], currentTagId: number) => {

            previous.push({
                record_id: recordId,
                tag_id: currentTagId
            });

            return previous;
        }, [])

        return db.insertNewRecordsTagsRelations(recordsTagsData);

    }).then(() => {
        // only send back id
        return responseObj;
    })
};

export const deleteRecord = async (id: number) => {
    return await db.deleteOneRecord(id);
};