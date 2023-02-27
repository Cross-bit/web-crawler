import { StatusCodes } from 'http-status-codes';
import StatusError from "./StatusError"

export default class ConflictError extends StatusError {
    constructor(message: string = 'Conflict occured') {
        super(StatusCodes.CONFLICT, message);
        Object.setPrototypeOf(this, ConflictError);
    }
}



export class TagCreationConflictError extends ConflictError {
    readonly tagName: string;
    readonly error?: Error;
    
    constructor(tagName: string, details?:any, error?: Error) {
        const message = `Error creating tag with name: ${tagName}, tag already exists`;
        super(message);
        this.details = details;
        this.tagName = tagName;
        this.error = error;
        Object.setPrototypeOf(this, TagCreationConflictError.prototype);
    }
}
