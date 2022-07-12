import { Request, Response } from "express";
import * as recordsServices from "../services/recordsServices"

export const getAllRecords = async (req: Request, res: Response) => {
    const allRecords = await recordsServices.getAllRecords();
    res.send({ status: "OK", data: allRecords });
}

export const getOneRecord = async (req: Request, res: Response) => {

    const {
        params: { recordId },
    } = req;

    if (!recordId) return;

    const recordData = await recordsServices.getOneRecord(+recordId);

    res.send({ status: "OK", data: recordData });
}

export const deleteOneRecord = async (req: Request, res: Response) => {
    
    const {
        params: { recordId },
    } = req;

    if (!recordId)
        return;

    const recordData = await recordsServices.deleteOneRecord(+recordId);
    res.send({ status: "OK", data: recordData });
}