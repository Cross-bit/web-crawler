import { ExecutionNodeConnection, ExecutionNode, RecordData } from '../../interface';
import { PoolClient } from 'pg';


export async function getAllRecordsByNodeUrl(client: PoolClient, nodeUrl: string) : Promise<RecordData[]>
{
    const queryObj = {
        text: `SELECT records.* FROM records 
               INNER JOIN nodes ON records.id = nodes.record_id where nodes.url = $1`,
        values: [nodeUrl]
    }
    
    const queryRes = await client.query(queryObj);
    
    return Promise.resolve(queryRes.rows as RecordData[]);
}