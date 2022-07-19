import * as db from '../database/recordsDatabase'
import { getCountOfTagsInList } from '../database/tagsDatabase';
import { RecordCreation, RecordTagsRelationCreation } from '../database/interface';
import { TagsTags_Records_RelationsArgs } from '../database/graphql/generated';

export const getAllRecords = async () => {
    return await db.getAllRecords();
};

export const getOneRecord = async (id: number) => {
    return await db.getOneRecord(id);
};

export const updateOneRecord = async (id: number) => {
    return "todo";
};

export const createNewRecord = async (data: RecordCreation, tags: number[]) => {

    const responseObj = { recordId: 0 };

    return getCountOfTagsInList(tags).then((vals)=>{

        // check if all tags are valid
        if (vals.tags_aggregate.aggregate?.count != tags.length) {
            throw new Error("Invalid tag ids supplied");
        }

        return db.insertNewRecord(data);
    }).then((insertedRecord) => {

        const { insert_records_one }  = insertedRecord;
        const recordId = insert_records_one?.id ?? -1;

        responseObj.recordId = recordId;

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

export const deleteOneRecord = async (id: number) => {
    return await db.deleteOneRecord(id);
};