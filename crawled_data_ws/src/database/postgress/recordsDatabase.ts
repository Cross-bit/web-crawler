import { DbErrorMessage } from '../../Errors/DatabaseErrors/DatabaseError'
import * as elq from './elementaryQueries/nodesQueries'
import { ExcuteTransaction } from './connections';
import { RecordData } from '../interface';
import { PoolClient } from 'pg'
import { getAllRecordsByNodeUrl } from './elementaryQueries/recordsQueries';



export async function GetAllRecordsByNodeUrl(nodeUrl: string) {
    return await ExcuteTransaction(async (client: PoolClient) => {
        return getAllRecordsByNodeUrl(client, nodeUrl);
      }, DbErrorMessage.RetreivalError);
}