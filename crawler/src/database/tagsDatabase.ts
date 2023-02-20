import { GraphQLClient } from 'graphql-request'
import { AllTagsQuery, getSdk, InsertTagMutationVariables, TagsRecordRelationsByRecordIdQuery, CountOfTagsInListQuery, GetNumberOfTagsQuery } from './graphql/generated'

const API_ENDPOINT = process.env.HASURA_ENDPOINT_URL || 'http://hasura:8080/v1/graphql';

const graphQLClient = new GraphQLClient(API_ENDPOINT)
const sdk = getSdk(graphQLClient)

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