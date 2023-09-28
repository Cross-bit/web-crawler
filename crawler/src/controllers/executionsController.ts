import {NextFunction, Request, Response} from 'express'
import * as tagsServices from '../services/tagsServices'
import { ExecutionDTO, ExecutionWithRecordDTO } from '../services/DTOInterface'
import * as executionServices from '../services/executionsServices'
import { validationResult } from 'express-validator'
import { getAllExecutionsByRecordId } from '../services/executionsServices'
import { StatusCodes } from 'http-status-codes';
import BadRequestError from "../Errors/BadRequestError";
import GraphDataSSEConnections from "../services/SSE/GraphDataSSEConnections"

export const getAllExecutions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allExecutions: ExecutionDTO[] = await executionServices.getAllExecutions();
        res.status(StatusCodes.OK).send(allExecutions);
    }
    catch(err) {
        next(err);
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
    catch(err) {
        next(err);
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
        next(err);
    }
}

export const sendUpdatesOnSSE = async (req: Request, res: Response) => 
{
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Content-Encoding': 'none',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
    }

    res.writeHead(200, headers);

    // we add newly connected client
    GraphDataSSEConnections.addClient(res);
}