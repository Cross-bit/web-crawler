import * as executionsController from "../../controllers/executionsController";
import express, { Router } from "express";

export const router: Router = express.Router();



/**
 * @openapi
 * /api/v1/executions:
 *   get:
 *     summary: Gets all executions
 *     tags:
 *      - Executions
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:  
 *                 $ref: "#/components/schemas/ExecutionDTO"
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
router.get("/", executionsController.getAllExecutions);

/**
 * @openapi
 * /api/v1/executions/sse:
 *   get:
 *     summary: Opens SSE connection on executions
 *     tags:
 *      - Executions
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ExecutionDTO"
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
router.get("/sse", executionsController.sendUpdatesOnSSE);

/**
 * @openapi
 * /api/v1/executions/{recordID}:
 *   post:
 *     tags:
 *      - Executions
 *     summary: Creates new timed execution for given record by recordId.
 *     parameters:
 *          - in: path
 *            name: recordId
 *            required: true
 *            schema:
 *              type: integer
 *            description: The ID of the record which will have this execution.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ExecutionDTO"
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
router.post("/:recordId", executionsController.createNewUntimedExecution);
