import { Request, Response } from "express";
import * as recordsServices from "../services/recordsServices"
import { validationResult } from "express-validator";
import { RecordCreation } from "../database/interface"

export const getAllRecords = async (req: Request, res: Response) => {

    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');

    const allRecords = await recordsServices.getAllRecords();
    res.send(allRecords);
}

export const getOneRecord = async (req: Request, res: Response) => {

    const {
        params: { recordId },
    } = req;

    if (!recordId) return;

    const recordData = await recordsServices.getOneRecord(+recordId);

    res.send(recordData);
}

export const deleteOneRecord = async (req: Request, res: Response) => {

    const {
        params: { recordId },
    } = req;

    if (!recordId){
        // todo: handle error
        return;
    }

    const recordData = await recordsServices.deleteOneRecord(+recordId);
    res.send(recordData);
}

export const createNewRecord = async (req: Request, res: Response) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const { body } = req;

    const recordToCreate: RecordCreation = {
        url: body.url,
        label: body.label,
        periodicity: body.periodicity,
        boundary: body.boundary,
        active: body.active
    }

    const tagsIds: number[] = body.tags || [];

    try {
        const recordInserted = await recordsServices.createNewRecord(recordToCreate, tagsIds);
        res.send(recordInserted);
    }
    catch(error) {
        res.status(400).send(error);
    }

}