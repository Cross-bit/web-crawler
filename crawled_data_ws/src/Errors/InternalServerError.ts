import { StatusCodes } from 'http-status-codes';
import StatusError from "./StatusError"

export default class InternalServerError extends StatusError {
    constructor(message: string = 'Internal server error') {
        super(StatusCodes.INTERNAL_SERVER_ERROR, message);
        Object.setPrototypeOf(this, InternalServerError);
    }
}

/*
    Specific Errors for service layer (todo: maybe put into separate file)
*/