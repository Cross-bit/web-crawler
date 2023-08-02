import {NextFunction, Request, Response} from 'express'
import * as tagsServices from '../services/tagsServices'
import { ExecutionDTO, ExecutionWithRecordDTO } from '../services/DTOInterface'
import * as executionServices from '../services/executionsServices'
import { validationResult } from 'express-validator'
import { getAllExecutionsByRecordId } from '../services/executionsServices'
import { StatusCodes } from 'http-status-codes';
import BadRequestError from "../Errors/BadRequestError";

export const getAllExecutions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allExecutions: ExecutionDTO[] = await executionServices.getAllExecutions();
        res.status(StatusCodes.OK).send(allExecutions);
    }
    catch(err) {

    }
}

export const getRecordExecutions = async (req: Request, res: Response, next: NextFunction) => {
    try {   
        if (req.params.recordId) {
            const recordId = parseInt(req.params.recordId);

            const executions: ExecutionDTO[] = await getAllExecutionsByRecordId(recordId);
            

            res.status(StatusCodes.OK).send(executions);


        }
    }
    catch(err)
    {

    }
}

export const createNewUntimedExecution = async (req: Request, res: Response, next:NextFunction) => {
    try {
        console.log("first");
        const {
            params: { recordId }
        } = req
        
        const recordIdNum = +recordId;

        if (!recordIdNum || isNaN(recordIdNum as any)) {
            throw new BadRequestError("Invalid record ID format(must be positive number).");
        }

        await executionServices.createNewExecution({
            creation: new Date(),
            isTimed: false,
            recordId: recordIdNum
        });

        res.status(StatusCodes.OK).send();
    }
    catch(err) {
        next();
    }
}

export const deleteOneExecution = async (req: Request, res: Response) => {

}