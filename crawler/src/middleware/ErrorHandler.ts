import {Request, Response, NextFunction} from 'express'
import StatusError from '../Errors/StatusError';
import BadRequestError from '../Errors/BadRequestError';
import NotFoundError from '../Errors/NotFoundError';
import CustomDatabaseError from '../Errors/DatabaseErrors/DatabaseError';

/**
 * @openapi
 * components:
 *   schemas:
 *     ErrorResponse:
 *          description: An error occured
 *          type: object
 *          properties:
 *              error:
 *                  type: string
 *                  example: This is an error message
 *              details:
 *                  type: string
 *                  example: This is an error detail
 */
export default function clientErrorHandler (err:StatusError, req:Request, res:Response, next:NextFunction) {

    if (err instanceof CustomDatabaseError) { // special handling of database error if propagates this far...
        res.status(500).send({ error: err.SerializeMessage() });
    }
    
    let response: Partial<{ error: string, details?: string}> = { error: err.message }

    if (err.details)
        response.details = err.details;

    res.status(err.status || 500).send(response);
}