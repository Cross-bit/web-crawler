import { GraphQLClient } from 'graphql-request'
import { AllTagsQuery, getSdk, InsertTagMutationVariables, CountOfTagsInListQueryVariables, CountOfTagsInListQuery } from './graphql/generated'

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

export const getCountOfTagsInList = (tagIdsList: number[]) :  Promise<CountOfTagsInListQuery> => {
    return sdk.CountOfTagsInList({_in: tagIdsList});
}


