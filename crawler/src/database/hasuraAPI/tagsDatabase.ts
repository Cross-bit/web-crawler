import sdk from "./connection"
import { AllTagsQuery, InsertTagMutationVariables, TagsRecordRelationsByRecordIdQuery, CountOfTagsInListQuery, GetNumberOfTagsQuery } from './graphql/generated'


export const insertOneTag = (tagName: string) => {
    const params: InsertTagMutationVariables = {
        tag_name: tagName
    }
    
    return sdk.InsertTag(params);
}

export const getAllTags = () : Promise<AllTagsQuery> => {
    return sdk.AllTags();
}

export interface RecordTagsRelation {
    record_id: number,
    tag_id: number
}

/*interface TagsRecordRelations {
    tagsReconr: RecordTagsRelation[]
}*/

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