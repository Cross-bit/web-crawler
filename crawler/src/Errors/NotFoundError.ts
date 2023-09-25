import { StatusCodes } from 'http-status-codes';
import StatusError from "./StatusError"



export default class NotFoundError extends StatusError {
    constructor(message: string = 'Resource not found') {
        super(StatusCodes.NOT_FOUND, message);
        Object.setPrototypeOf(this, NotFoundError);
    }
}

export class RecordNotFoundError extends NotFoundError {
    readonly recordID: number;
    readonly error?: Error;
    
    constructor(recordID: number, error?: Error) {
        const message = `Record with id ${recordID} not found`;
        super(message);
        this.recordID = recordID;
        this.error = error;
        Object.setPrototypeOf(this, RecordNotFoundError.prototype);
    }
}