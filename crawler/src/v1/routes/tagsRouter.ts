import express, { Router } from 'express'
import { getAllTags, createNewTag } from '../../controllers/tagsController';
import * as validations from './validations/tagsRouterValidations'
export const router: Router = express.Router();


/**
 * @openapi
 * /api/v1/tags:
 *   get:
 *     summary: Gets all the created tags
 *     tags:
 *      - Tags
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:  
 *                 $ref: "#/components/schemas/TagDTO"
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
router.get('/', getAllTags);


/**
 * @openapi
 * /api/v1/tags:
 *   post:
 *     summary: Creates new tag
 *     tags:
 *      - Tags
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/TagCreationDTO"
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TagDTO"
 *       5XX:
 *           $ref: "#/components/schemas/ErrorResponse"
 */
router.post('/', ...validations.createNewTagValidation, createNewTag);
