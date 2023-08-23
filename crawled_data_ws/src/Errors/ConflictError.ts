import { StatusCodes } from 'http-status-codes';
import StatusError from "./StatusError"

export default class ConflictError extends StatusError {
    constructor(message: string = 'Conflict occured') {
        super(StatusCodes.CONFLICT, message);
        Object.setPrototypeOf(this, ConflictError);
    }
}
