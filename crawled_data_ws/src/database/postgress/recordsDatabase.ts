import { DbErrorMessage } from '../../Errors/DatabaseErrors/DatabaseError'
import * as elq from './elementaryQueries/nodesQueries'
import { ExcuteTransaction } from './connection';
import { RecordData, RecordDataWithTags, TagData } from '../interface';
import { PoolClient } from 'pg'
import {getAllTagsByRecordIdQuery} from './elementaryQueries/tagsQueries';
import { getAllRecordsByNodeUrl as getAllRecordsByNodeUrlQuery,
         getAllRecordsByNodeIds as getAllRecordsByNodeIdsQuery, 
         getRecordsByIdsQuery, 
         getAllRecordsQuery} from './elementaryQueries/recordsQueries';



export async function GetAllRecordsByNodeUrl(nodeUrl: string) {
    return await ExcuteTransaction(async (client: PoolClient) => {
        return getAllRecordsByNodeUrlQuery(client, nodeUrl);
      }, DbErrorMessage.RetreivalError);
}

export async function GetAllRecordsByIds(recordIDs: number[]) : Promise<RecordData[]>
{
  return await ExcuteTransaction(async (client: PoolClient) => {
      return getRecordsByIdsQuery(client, recordIDs);
    }, DbErrorMessage.RetreivalError);
}

export async function GetAllRecordsWithTagsByNodeIds(nodeIds: number[]) : Promise<RecordDataWithTags[]>
{
  return await ExcuteTransaction(async (client: PoolClient) => {
    const records = await getAllRecordsByNodeIdsQuery(client, nodeIds);

    const result: RecordDataWithTags[] = []

    const recordsWithTagsPormise = records.map(async (record) => {
      const tags = await getAllTagsByRecordIdQuery(client, record.id)
      result.push({
        ...record,
        tags
      })
    });


    await Promise.all(recordsWithTagsPormise);

    return result;

  }, DbErrorMessage.RetreivalError)
}


export async function GetAllRecordsWithTags() : Promise<RecordDataWithTags[]>
{
  return await ExcuteTransaction(async (client: PoolClient) => {
    const records = await getAllRecordsQuery(client);

    const result: RecordDataWithTags[] = []

    const recordsWithTagsPormise = records.map(async (record) => {
      const tags = await getAllTagsByRecordIdQuery(client, record.id)
      result.push({
        ...record,
        tags
      })
    });


    await Promise.all(recordsWithTagsPormise);
    
    return result;

  }, DbErrorMessage.RetreivalError)
}