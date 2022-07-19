import * as recordsController from "../../controllers/recordsController";
import express, { Router } from "express";
import * as validations from './validations/recordsRouterValidations'

export const router: Router = express.Router();


/**
 * @openapi
 * /api/v1/records:
 *   get:
 *     tags:
 *       - Workouts
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: array
 *                   items:
 *                      $ref: "#/components/schemas/Record"
 *       5XX:
 *         description: FAILED
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: FAILED
 *                 data:
 *                   type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: "Some error message"
 */
router.get("/", recordsController.getAllRecords );

router.post("/", ... validations.createNewRecordValidation, recordsController.createNewRecord );

router.get("/:recordId", recordsController.getOneRecord );

router.delete("/:recordId", recordsController.deleteOneRecord );

router.patch("/:recordId", recordsController.updateOneRecord)
