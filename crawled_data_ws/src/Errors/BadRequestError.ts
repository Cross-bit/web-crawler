import { StatusCodes } from 'http-status-codes';
import StatusError from "./StatusError"

export default class BadRequestError extends StatusError {
    constructor(message: string = 'Bad request') {
        super(StatusCodes.BAD_REQUEST, message);
        Object.setPrototypeOf(this, BadRequestError);
    }
}