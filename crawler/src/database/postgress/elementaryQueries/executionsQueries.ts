import { ExecutionData } from '../../interface';
import query, { pool } from "../connection"
import { RecordCreationError } from '../../../Errors/InternalServerError';
import { Pool, PoolClient } from 'pg';


export const createNewExecutionQuery = async (client:PoolClient, executionData: ExecutionData) => {

    const queryInsert = {
        text: "INSERT INTO executions () VALUES",
        data: []
    }
}

export const updateExecutionQuery = async (client:PoolClient, executionData: ExecutionData) => {

    const queryInsert = {
        text: "INSERT INTO executions () VALUES",
        data: []
    }
}