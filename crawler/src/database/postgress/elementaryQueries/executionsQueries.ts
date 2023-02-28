import { RecordData, ExecutionRecord, RecordDataPartial, TagData} from '../../interface';
import query, { pool } from "../connection"
import { RecordCreationError } from '../../../Errors/InternalServerError';
import { PoolClient } from 'pg';


export const createNewExecution = async (executionData:ExecutionRecord) => {
    
}