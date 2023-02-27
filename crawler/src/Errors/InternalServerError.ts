import { StatusCodes } from 'http-status-codes';
import StatusError from "./StatusError"
import { CreateRecordDTO } from '../services/DTOInterface';
import { RecordDataPartial } from '../database/interface';

export default class InternalServerError extends StatusError {
    constructor(message: string = 'Internal server error') {
        super(StatusCodes.INTERNAL_SERVER_ERROR, message);
        Object.setPrototypeOf(this, InternalServerError);
    }
}

/*
    Specific Errors for service layer (todo: maybe put into separate file)
*/

/**
 * Custom errro for tags retrival for specific record
 */
export class TagRetrievalError extends InternalServerError {    
    readonly recordId?: number;
    readonly error?: Error;


    public constructor (error?: Error);
    public constructor(recordId?: number, error?: Error);

    constructor (recordIdOrError?: any, error?: Error) {

        let message = `Error retrieving tags`;
        if (!isNaN(recordIdOrError))
            message = `Error retrieving tags for record with id ${recordIdOrError as number}`;

        super(message);
        this.recordId = recordIdOrError;
        this.error = error;
        Object.setPrototypeOf(this, TagRetrievalError.prototype);
    }
}

/**
 * Custom errro for tags retrival for specific record
 */
export class TagCreationError extends InternalServerError {    
    readonly tagName: string;
    readonly error?: Error;
    
    constructor(tagName: string, details?:any, error?: Error) {
        const message = `Error while creating tag with name: ${tagName}`;
        super(message);
        this.details = details;
        this.tagName = tagName;
        this.error = error;
        Object.setPrototypeOf(this, TagRetrievalError.prototype);
    }
}


/**
 * Custom errro for tags retrival for specific record
 */
export class RecordCreationError extends InternalServerError {    
    readonly recordData: CreateRecordDTO | RecordDataPartial;
    readonly error?: Error;
    
    constructor(recordData: CreateRecordDTO | RecordDataPartial, error?: Error) {
        const message = `Error while creating record`;
        super(message);

        this.details = recordData;

        this.recordData = recordData;
        this.error = error;
        Object.setPrototypeOf(this, TagRetrievalError.prototype);
    }
}

export class RecordDeletionError extends InternalServerError {    
    readonly error?: Error;
    
    constructor(recordID:number, error?: Error) {
        const message = `Unable to delete record id ${recordID}`;
        super(message);

        this.error = error;
        Object.setPrototypeOf(this, RecordDeletionError.prototype);
    }
}