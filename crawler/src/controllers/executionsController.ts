import {NextFunction, Request, Response} from 'express'
import * as tagsServices from '../services/tagsServices'
import { validationResult } from 'express-validator'



export const createNewExecution = async (req: Request, res: Response, next:NextFunction) => {
    try {

    }
    catch(err) {
        next();
    }
}

export const deleteOneExecution = async (req: Request, res: Response) => {

}