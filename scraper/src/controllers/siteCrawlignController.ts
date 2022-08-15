import { Request, Response } from "express";
import * as recordsServices from "../services/recordsServices"
import { validationResult } from "express-validator";
import { RecordData, RecordDataPartial } from "../database/interface"


