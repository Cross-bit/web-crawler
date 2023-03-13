import { NextFunction, Request, Response } from "express";
import * as recordsServices from "../services/recordsServices"
import * as executionServices from "../services/executionsServices"
import { validationResult } from "express-validator";
import BadRequestError from "../Errors/BadRequestError";
import {CreateRecordDTO, RecordDTO, UpdateRecordDTO} from "../services/DTOInterface";
import ValidationError from "../Errors/ValidationError";
import { executionState } from "../utils/enums";


export const getAllRecords = async (req: Request, res: Response) => {
    try {
        const allRecords: RecordDTO[] = await recordsServices.getAllRecords() as RecordDTO[];
        res.status(200).send(allRecords);
    }
    catch(err) {
        throw err;
    }    
}

export const getOneRecord = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const {
            params: { recordId },
        } = req;
        
        if (!recordId || isNaN(recordId as any)) {
            throw new BadRequestError("Invalid record ID format(must be positive number).");
        }
    
        const recordData: RecordDTO = await recordsServices.getRecord(+recordId) as RecordDTO;

        res.send(recordData);
    }
    catch(err) {
        next(err);
    }
}

export const deleteOneRecord = async (req: Request, res: Response) => {

    const {
        params: { recordId },
    } = req;

    if (!recordId || isNaN(recordId as any)){
        throw new BadRequestError("Invalid record ID format(must be positive number).");
    }

    const recordData = await recordsServices.deleteRecord(+recordId);

    res.send(recordData);
}

export const createNewRecord = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            throw new ValidationError(errors);

        const { body } = req;

        const recordToCreate: CreateRecordDTO = {
            url: body.url,
            label: body.label,
            periodicity_min: body.periodicity_min,
            periodicity_hour: body.periodicity_hour,
            periodicity_day: body.periodicity_day,
            boundary: body.boundary,
            active: body.active,
            tags: body.tags || []
        }

        const insertedRecordId = await recordsServices.createNewRecord(recordToCreate);
        
        if (recordToCreate.active) {
            // if active serve executions
            
            executionServices.createNewExecution({
                    creation: new Date(),
                    isTimed: true,
                    recordId: insertedRecordId
            });
        }

        res.status(201).send({payload: insertedRecordId});
    }
    catch(error) {
        next(error)
    }
}

export const updateOneRecord = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            throw new ValidationError(errors);
        }

        const { body } = req;

        const {
            params: { recordId },
        } = req;

        if (isNaN(+recordId))
            throw new ValidationError(recordId);


        const updateRecord: UpdateRecordDTO = {
            id: +recordId,
            url: body.url,
            label: body.label,
            periodicity_min: body.periodicity_min,
            periodicity_hour: body.periodicity_hour,
            periodicity_day: body.periodicity_day,
            boundary: body.boundary,
            active: body.active,
            tags: body.tags || []
        }
        
        
   
        await recordsServices.updateRecord(updateRecord); // ret rec id
        
        res.status(201).send();
    }
    catch(error) {
        next(error)
    }
}