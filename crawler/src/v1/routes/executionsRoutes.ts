import * as executionsController from "../../controllers/executionsController";
import express, { Router } from "express";
import * as validations from './validations/recordsRouterValidations'

export const router: Router = express.Router();


router.get("/", executionsController.getAllExecutions);

//router.get("/:recordId", executionsController.getRecordExecutions);
router.get("/sse", executionsController.sendUpdatesOnSSE);

router.post("/:recordId", executionsController.createNewUntimedExecution);
