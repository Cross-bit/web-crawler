import { PoolClient } from 'pg';
import { ExecutionData, GetExecutionsDataFilter } from '../../interface';

export const getExecutionsQuery = async (client: PoolClient, excutionsFilter?: GetExecutionsDataFilter) : Promise<ExecutionData[]> => {

    let queryStr = "SELECT * FROM executions"
    const queryVals = []

    queryStr += (excutionsFilter) ?  " WHERE " : "";
    const conditions = [];

    if (excutionsFilter?.state) {
        conditions.push(`state_of_execution = $${queryVals.length + 1}`);
        queryVals.push(excutionsFilter?.state);
    }

    if (excutionsFilter?.isTimed) {
        conditions.push(`is_timed = $${queryVals.length + 1}`);
        queryVals.push(excutionsFilter?.isTimed);
    }

    if (excutionsFilter?.recordId) {
        conditions.push(`record_id = $${queryVals.length + 1}`);
        queryVals.push(excutionsFilter?.recordId);
    }

    queryStr += conditions.join(" AND ");

    const queryRes = await client.query({text: queryStr, values: queryVals});

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

export const updateExecutionQuery = async (client:PoolClient, executionData: ExecutionData) => {
    const queryInsert = {
        text: "INSERT INTO executions () VALUES",
        data: []
    }
}