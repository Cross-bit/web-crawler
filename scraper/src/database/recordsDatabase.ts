import { GraphQLClient } from 'graphql-request'
import { getSdk, GetRecordQueryVariables } from './graphql/generated'

const API_ENDPOINT = process.env.HASURA_ENDPOINT_URL || 'http://hasura:8080/v1/graphql';

const graphQLClient = new GraphQLClient(API_ENDPOINT)
const sdk = getSdk(graphQLClient)

/**
 * @openapi
 * components:
 *   schemas:
 *     Record:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         url:
 *           type: string
 *           example: http://www.example.com
 *         boundary:
 *           type: string
 *           example: /example.com/
 *         periodicity:
 *           type: number
 *           example: 60
 *         label:
 *           type: string
 *           example: Example
 *         active:
 *           type: bool
 *           example: true
 */
export const getAllRecords = async () => {
    return sdk.AllRecords();
}

export const getOneRecord = async (id: number) => {

    const params: GetRecordQueryVariables = {
        id: id
    }

    return sdk.GetRecord(params);
}

export const deleteOneRecord = async (id: number) => {
    //we count on cascade on deletation in db
    const params: GetRecordQueryVariables = {
        id: id
    }

    return sdk.DeleteRecord(params);
}