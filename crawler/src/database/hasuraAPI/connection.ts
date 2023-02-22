import { GraphQLClient } from 'graphql-request'
import { getSdk } from './graphql/generated'


const API_ENDPOINT = process.env.HASURA_ENDPOINT_URL || 'http://hasura:8080/v1/graphql';

const graphQLClient = new GraphQLClient(API_ENDPOINT);

export default getSdk(graphQLClient);