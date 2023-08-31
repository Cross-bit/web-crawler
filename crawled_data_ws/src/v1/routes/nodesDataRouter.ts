import * as graphDataController from "../../controllers/graphDataController";
import express, { Router } from "express";

export const router: Router = express.Router();

router.get("/:nodeUrl/records", graphDataController.getAllRecordsToNode);