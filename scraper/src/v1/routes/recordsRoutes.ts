import * as recordsController from "../../controllers/recordsController";

import express, { Router } from "express";

export const router: Router = express.Router();

router.get("/", recordsController.getAllRecords );