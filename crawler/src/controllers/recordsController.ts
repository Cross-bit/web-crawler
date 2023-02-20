import { Request, Response } from "express";
import * as recordsServices from "../services/recordsServices"
import { validationResult } from "express-validator";
import { RecordData, RecordDataPartial } from "../database/interface"

export const getAllRecords = async (req: Request, res: Response) => {

    const allRecords = await recordsServices.getAllRecords();
    res.send(allRecords);
}

export const getOneRecord = async (req: Request, res: Response) => {

    const {
        params: { recordId },
    } = req;

    if (!recordId){
        res.status(400).send({error: "Id not valid"}); // todo: make it better
        return;
    }

    const recordData = await recordsServices.getRecord(+recordId);

    res.send(recordData);
}

export const deleteOneRecord = async (req: Request, res: Response) => {

    const {
        params: { recordId },
    } = req;

    if (!recordId){
        res.status(400).send({error: "Id not valid"});
        return;
    }

    const recordData = await recordsServices.deleteRecord(+recordId);
    res.send(recordData);
}

export const createNewRecord = async (req: Request, res: Response) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const { body } = req;

    const recordToCreate: RecordData = {
        url: body.url,
        label: body.label,
        periodicity: body.periodicity,
        boundary: body.boundary,
        active: body.active
    }

    const tagsIds: number[] = body.tags || [];

    try {
        const recordInserted = await recordsServices.createNewRecord(recordToCreate, tagsIds);
        res.status(201).send(recordInserted);
    }
    catch(error) {
        res.status(400).send(error);
    }
}

export const updateOneRecord = async (req: Request, res: Response) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const { body } = req;
    const dataToUpdate: RecordDataPartial = { }

    const {
        params: { recordId },
    } = req;

    // record data update
    dataToUpdate.id = +recordId; // todo: do check if it is really number!!
    body.active !== undefined && (dataToUpdate.active = body.active);
    body.label && (dataToUpdate.label = body.label);
    body.url && (dataToUpdate.url = body.url);
    body.boundary && (dataToUpdate.boundary = body.boundary);
    body.periodicity && (dataToUpdate.periodicity = body.periodicity);

    // tags update
    const tagsIds: number[] = body.tags || [];

    try {
        const recordUpdated = await recordsServices.updateRecord(dataToUpdate, tagsIds); // ret rec id
        res.status(201).send(recordUpdated);
    }
    catch(error) {
        res.status(400).send(error);
    }
}