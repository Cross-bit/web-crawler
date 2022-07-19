import {Request, Response} from 'express'
import * as tagsServices from '../services/tagsServices'
import { validationResult } from 'express-validator'

export const getAllTags = async (req: Request, res: Response)  => {

    const tagsData = await tagsServices.getAllTags();

    if (!tagsData){
        res.status(400).send({ error: 'Fetching tags failed'});
        return;
    }

    res.send(tagsData?.tags);
}

export const createNewTag = async (req: Request, res: Response)  => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const { body } = req;

    const createdTag = await tagsServices.createNewTag(body.name);
    res.status(201).send(createdTag);
}