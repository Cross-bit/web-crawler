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


export async function getAllRecordsByNodeIds(client: PoolClient, nodeIds: number[]) : Promise<RecordData[]>
{
    const queryObj = {
        text: `SELECT records.* FROM records 
                INNER JOIN nodes ON records.id = nodes.record_id where nodes.record_id = ANY($1) GROUP BY records.id`,
        values: [nodeIds]
    }
    
    const queryRes = await client.query(queryObj);
    
    return Promise.resolve(queryRes.rows as RecordData[]);
}


/**
 * Returns records by record ids
 * @param client 
 * @param recordId 
 * @returns 
 */
export const getRecordsByIdsQuery = async (client: PoolClient, recordIds: number[]) => {
    const qeueryRes = await client.query("SELECT * FROM records WHERE id = ANY($1)", [recordIds]);

    const queryRes:RecordData[] = [];

    qeueryRes.rows.forEach(queriedRow => {
        queryRes.push(
            {
                id: queriedRow.id,
                url: queriedRow.url,
                periodicity_min: queriedRow.periodicity_minute,
                periodicity_hour: queriedRow.periodicity_hour,
                periodicity_day: queriedRow.periodicity_day,
                label: queriedRow.label,
                boundary: queriedRow.boundary,
                active: queriedRow.active
            }
        );
    });

    return Promise.resolve(queryRes);
}

export const getAllRecordsQuery = async (client: PoolClient) => {
    const qeueryRes = await client.query("SELECT * FROM records");
    
    const result:RecordData[] = qeueryRes.rows.map((queryRow: any) => ({
        id: queryRow.id,
        url: queryRow.url,
        periodicity_min: queryRow.periodicity_minute,
        periodicity_hour: queryRow.periodicity_hour,
        periodicity_day: queryRow.periodicity_day,
        label: queryRow.label,
        boundary: queryRow.boundary,
        active: queryRow.active
    }));

    return Promise.resolve(result);
}