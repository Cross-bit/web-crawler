import { StatusCodes } from 'http-status-codes';
import BadRequestError from "./BadRequestError"

export default class ValidationError extends BadRequestError {
    constructor(validationData:any) { // todo: any...
        const message = "Validation error"
        super(message);
        this.details = validationData;
        Object.setPrototypeOf(this, ValidationError);
    }
}