import * as graphDataController from "../../controllers/graphDataController";
import express, { Router } from "express";

export const router: Router = express.Router();



//router.get("/nodes/:nodeUrl/records", graphDataController.getAllRecordsToNode);

router.get("/:recordId", graphDataController.sendGraphDataSSE);