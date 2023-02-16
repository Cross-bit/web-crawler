import { GraphQLClient } from 'graphql-request'
import { getSdk, GetAllPlannedExecutionsQuery } from './graphql/generated'
import * as dbInterface from './interface';

const API_ENDPOINT = process.env.HASURA_ENDPOINT_URL || 'http://hasura:8080/v1/graphql';

const graphQLClient = new GraphQLClient(API_ENDPOINT);
const sdk = getSdk(graphQLClient);



export const GetAllPlannedExecutions = async () => {
    return await sdk.GetAllPlannedExecutions();
}

