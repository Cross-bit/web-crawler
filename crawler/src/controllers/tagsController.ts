import {NextFunction, Request, Response} from 'express'
import * as tagsServices from '../services/tagsServices'
import { validationResult } from 'express-validator'
import ValidationError from '../Errors/ValidationError'
import {TagCreationDTO, TagDTO} from '../services/DTOInterface'

export const getAllTags = async (req: Request, res: Response, next:NextFunction)  => {
    try{
        const tagsData: TagDTO[] = await tagsServices.getAllTags();
    
        /* if (!tagsData) {
            res.status(400).send({ error: 'Fetching tags failed'});
            return;
        } */
    
        res.send(tagsData);

    }catch(err){
        next(err);
    }
}

export const createNewTag = async (req: Request, res: Response, next:NextFunction)  => {
    try{
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            throw new ValidationError(errors.array());
        }

        const { body } = req;

        const newTagData:TagDTO = await tagsServices.createNewTag(body as TagCreationDTO);

        res.status(201).send(newTagData); // todo standardize responses...
    }
    catch(err) {
        next(err);
    }
}