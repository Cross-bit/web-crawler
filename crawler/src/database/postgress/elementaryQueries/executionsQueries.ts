import { PoolClient } from 'pg';
import { ExecutionData } from '../../interface';


export const getAllExecutionsQuery = async (client: PoolClient, executionData:ExecutionData ) : Promise<ExecutionData[]>{

    const queryStr = "SELECT * FROM executions"
    const queryRes = await client.query(queryStr);
    
    // TODO: :)
    return Promise.resolve(queryRes as ExecutionData[]);
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