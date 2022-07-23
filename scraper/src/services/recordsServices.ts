import * as db from '../database/recordsDatabase'
import { getCountOfTagsInList as getCountOfTagsWithIds, getAllTagsRecordRelationsByRecordId } from '../database/tagsDatabase';
import { RecordData, RecordDataPartial, RecordTagsRelationCreation } from '../database/interface';


export const getAllRecords = async () => {
    return db.getAllRecords().then((recordsData) => {

        const result:any [] = [];

        recordsData.records.forEach((record) => {
            const tagsArr = record.tags.map(tagsData => ({name: tagsData.tag.tag_name, id: tagsData.tag.id}))
            result.push({ ...record, tags: tagsArr});
        })

        return result;
    });
};

export const getOneRecord = async (id: number) => {
    return await db.getOneRecord(id);
};

export const updateOneRecord = async (recordData: RecordDataPartial, updatedTags: number[]) => {

    const recordId = recordData.id || -1;

    if (recordId < 0)// no id sent
        throw new Error("Internal server error.");


    return getCountOfTagsWithIds(updatedTags).then((vals) => {
        // first check if all clients tags are valid

        // check if all tags are valid
        if (vals.tags_aggregate.aggregate?.count != updatedTags.length) {
            throw new Error("Invalid tag ids supplied"); // todo: not returned properly
        }

        return db.updateRecordData(recordData);

    }).then((updatedRecord) => getAllTagsRecordRelationsByRecordId(recordId) ).then(({ tags_records_relations }) => {

        // if changes in tags were made:
        const oldTags = tags_records_relations.map(recordData => recordData.tag_id).sort();

        const newTagsAdded: number[] = [];
        const oldRelationsToRemove: number[] = [];

        updatedTags.forEach(value => {
            if (!oldTags.includes(value)) {
                newTagsAdded.push(value)
            }
        })

        tags_records_relations.forEach(value => {
            if (!updatedTags.includes(value.tag_id)) {
                oldRelationsToRemove.push(value.id)
            }
        })

        // todo: fix DRY
        //.map((currentTagId: number)  => ({record_id: recordId, tag_id: currentTagId})) // todo: why not map?
        const recordsTagsData: RecordTagsRelationCreation[] = newTagsAdded?.reduce((previous: RecordTagsRelationCreation[], currentTagId: number) => {

            previous.push({
                record_id: recordId,
                tag_id: currentTagId
            });

            return previous;
        }, [])

        return db.UpdateRecordRelations(oldRelationsToRemove, recordsTagsData);
    }).then(() => {


        return {recordId: recordId};
    })
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

export const deleteOneRecord = async (id: number) => {
    return await db.deleteOneRecord(id);
};