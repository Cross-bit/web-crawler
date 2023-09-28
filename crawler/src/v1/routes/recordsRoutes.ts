import * as recordsController from "../../controllers/recordsController";
import * as executionsController from "../../controllers/executionsController";
import express, { Router } from "express";
import * as validations from './validations/recordsRouterValidations'

export const router: Router = express.Router();

/**
 * @openapi
 * /api/v1/records:
 *   get:
 *     summary: Gets all the records
 *     tags:
 *      - Records
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:  
 *                 $ref: "#/components/schemas/RecordDTO"
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
router.get("/", recordsController.getAllRecords);

/**
 * @openapi
 * /api/v1/records/{recordId}:
 *   get:
 *     summary: Get a single record by it's unique record ID.
 *     tags:
 *      - Records
 *     parameters:
 *          - in: path
 *            name: recordId
 *            required: true
 *            schema:
 *              type: integer
 *            description: The ID of the record to get.
*     responses:
*       200:
*         description: OK
*         content:
*           application/json:
*             schema:
*               $ref: "#/components/schemas/RecordDTO"
*       5XX:
*           $ref: "#/components/schemas/ErrorResponse"
*/
router.get("/:recordId", recordsController.getOneRecord);

/**
 * @openapi
 * /api/v1/records:
 *   post:
 *     summary: Creates new record
 *     tags:
 *      - Records
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateRecordDTO"
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payload:
 *                   type: integer
 *                   example: 123
 *       5XX:
 *           $ref: "#/components/schemas/ErrorResponse"
 */
router.post("/", ... validations.createNewRecordValidation, recordsController.createNewRecord);



/**
 * @openapi
 * /api/v1/records/{recordId}:
 *   delete:
 *     summary: Deletes single record
 *     tags:
 *      - Records
 *     parameters:
 *          - in: path
 *            name: recordId
 *            required: true
 *            schema:
 *              type: integer
 *            description: The ID of the record to delete.
 *     response:
 *       5XX:
 *           $ref: "#/components/schemas/ErrorResponse"
 */
router.delete("/:recordId", recordsController.deleteOneRecord);

/**
 * @openapi
 * /api/v1/records/{recordId}:
 *   patch:
 *     summary: Updates single record
 *     tags:
 *      - Records
 *     parameters:
 *          - in: path
 *            name: recordId
 *            required: true
 *            schema:
 *              type: integer
 *            description: The ID of the record to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateRecordDTO"
 *       5XX:
 *           $ref: "#/components/schemas/ErrorResponse"
 */
router.patch("/:recordId", ...validations.updateOneRecordValidation, recordsController.updateOneRecord )


/**
 * @openapi
 * /api/v1/records/{recordId}/executions:
 *   get:
 *     summary: Returns list of all executions for the record specified by the recordId.
 *     tags:
 *      - Records 
 *     parameters:
 *          - in: path
 *            name: recordId
 *            required: true
 *            schema:
 *              type: integer
 *            description: The ID of the record to which we want to get executions.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ExecutionDTO"
 *       5XX:
 *           $ref: "#/components/schemas/ErrorResponse"
 */
router.get("/:recordId/executions", executionsController.getRecordExecutions);
