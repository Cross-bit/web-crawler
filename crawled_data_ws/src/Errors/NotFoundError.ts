import { StatusCodes } from 'http-status-codes';
import StatusError from "./StatusError"

export default class NotFoundError extends StatusError {
    constructor(message: string = 'Resource not found') {
        super(StatusCodes.NOT_FOUND, message);
        Object.setPrototypeOf(this, NotFoundError);
    }
}
