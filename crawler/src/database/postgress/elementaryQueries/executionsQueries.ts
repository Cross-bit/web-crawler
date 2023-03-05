import { executeSync } from 'graphql';
import { PoolClient } from 'pg';
import { ExecutionData, ExecutionDataWithRecord, ExecutionsDataFilter } from '../../interface';


// helper function to filter executions
const FilterExecutionsInQuery = (originalQuery: { text: string, values: any[] } | string, excutionsFilter?: ExecutionsDataFilter) => {
    
    let queryStr = typeof originalQuery === 'string' ? originalQuery : originalQuery.text;
    const queryVals = typeof originalQuery === 'string' ? [] : [...originalQuery.values];
    const conditions = [];

    if (excutionsFilter?.executionIDs) {
        conditions.push(`executions.id = ANY ($${queryVals.length + 1})`);
        queryVals.push(excutionsFilter?.executionIDs);
    }

    if (excutionsFilter?.state) {
        conditions.push(`state_of_execution = ANY ($${queryVals.length + 1})`);
        queryVals.push(excutionsFilter?.state);
    }

    if (excutionsFilter?.isTimed) {
        conditions.push(`is_timed = $${queryVals.length + 1}`);
        queryVals.push(excutionsFilter?.isTimed);
    }

    if (excutionsFilter?.recordId) {
        conditions.push(`record_id = ANY ($${queryVals.length + 1})`);
        queryVals.push(excutionsFilter?.recordId);
    }

    if (conditions.length > 0)
        queryStr +=  " WHERE "

    queryStr += " " + conditions.join(" AND ");

    return {text: queryStr, values: queryVals} ;
}

export const getExecutionsQuery = async (client: PoolClient, executionsFilter?: ExecutionsDataFilter) : Promise<ExecutionData[]> => {

    let queryStr = "SELECT * FROM executions"
    const queryObj = FilterExecutionsInQuery(queryStr, executionsFilter)

    const queryRes = await client.query(queryObj);

    const result:ExecutionData[] = queryRes.rows.map((queryRow: any) => ({
        id: queryRow.id,
        creation: new Date(queryRow.creation_time),
        executionStart: queryRow.start_time ? new Date(queryRow.start_time) : null,
        executionDuration: queryRow.duration_time,
        state: queryRow.state_of_execution,
        isTimed: queryRow.is_timed,
        recordId: queryRow.record_id
    }));

    return Promise.resolve(result);
}

export const getAllExecutionsWithRecords = async (client: PoolClient, executionsFilter?: ExecutionsDataFilter) => {
    const queryStr = "SELECT * FROM executions INNER JOIN records ON executions.record_id = records.id";
    const queryObj = FilterExecutionsInQuery(queryStr, executionsFilter);

    const queryRes = await client.query(queryObj);

    const result:ExecutionDataWithRecord[] = queryRes.rows.map((queryRow: any) => ({
        id: queryRow.id,
        creation: new Date(queryRow.creation_time),
        executionStart: queryRow.start_time ? new Date(queryRow.start_time) : null,
        executionDuration: queryRow.duration_time,
        state: queryRow.state_of_execution,
        isTimed: queryRow.is_timed,
        record: {
            id: queryRow.record_id,
            url: queryRow.url,
            periodicity_min: queryRow.periodicity_minute,
            periodicity_hour: queryRow.periodicity_hour,
            periodicity_day: queryRow.periodicity_day,
            label: queryRow.label,
            boundary: queryRow.boundary,
            active: queryRow.active
        }
    }));

    return Promise.resolve(result);
}

export const createNewExecutionQuery = async (client:PoolClient, executionData: ExecutionData) : Promise<number> => {

    const queryInsert = {
        text: `INSERT INTO executions (creation_time, start_time, duration_time, is_timed, state_of_execution, record_id) 
        VALUES($1, $2, $3, $4, $5, $6) RETURNING id`,
        values: [
            executionData.creation.toUTCString(),
            executionData.executionStart?.toUTCString(),
            executionData.executionDuration,
            executionData.isTimed,
            executionData.state,
            executionData.recordId
        ]
    };
    const queryRes = await client.query(queryInsert);

    return Promise.resolve(queryRes.rows[0].id);
}

export const updateExecutionQuery = async (client:PoolClient, executionState: string, executionsFilter: ExecutionsDataFilter) => {

    const queryUpdateInit = {
        text: "UPDATE executions SET state_of_execution = $1 ",
        values: [executionState]
    }

    const queryUpdateFiltered = FilterExecutionsInQuery(queryUpdateInit, executionsFilter)

    queryUpdateFiltered.text += " RETURNING id"

    const updatedIds = await client.query(queryUpdateFiltered);

    return updatedIds.rows?.map(row => row.id) as number[];
}