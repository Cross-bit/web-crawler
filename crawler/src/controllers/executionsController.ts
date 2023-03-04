import {NextFunction, Request, Response} from 'express'
import * as tagsServices from '../services/tagsServices'
import { ExecutionDTO, ExecutionWithRecordDTO } from '../services/DTOInterface'
import * as executionServices from '../services/executionsServices'
import { validationResult } from 'express-validator'


export const getAllExecutions = async (req: Request, res: Response, next: NextFunction) => {
    try
    {
        const allExecutions: ExecutionDTO[] = await executionServices.getAllExecutions();
        res.status(200).send(allExecutions);
    }
    catch(err) {

    }
}


export const createNewExecution = async (req: Request, res: Response, next:NextFunction) => {
    try {

    }
    catch(err) {
        next();
    }
}

export const deleteOneExecution = async (req: Request, res: Response) => {

}