import { Request, Response } from "express"

export const getAllRecords = (req: Request, res: Response) => {
    res.send("from controller ok");
}