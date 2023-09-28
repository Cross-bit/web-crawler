
import { executionState } from "../utils/enums";

// Here we define DTO's (Data transfer objects that API returns/accepts)

/** New record creation DTO (we want client to always send all the data) */


/**
 * @openapi
 * components:
 *   schemas:
 *     CreateRecordDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         url:
 *           type: string
 *           example: http://www.example.com
 *         boundary:
 *           type: string
 *           example: /example.com/
 *         periodicity:
 *           type: number
 *           example: 60
 *         periodicity_min:
 *           type: number
 *           minimum: 0
 *           maximum: 60
 *           example: 42
 *         periodicity_hour:
 *           type: number
 *           minimum: 0
 *           maximum: 23
 *           example: 12
 *         periodicity_day:
 *           type: number
 *           minimum: 0
 *           maximum: 365
 *           example: 1
 *         label:
 *           type: string
 *           example: Example
 *         active:
 *           type: bool
 *           example: true 
 *         tags:
 *          type: array
 *          items:
 *             type: number
 *          example: [1, 2, 3]
 */
export type CreateRecordDTO = {
    url: string
    periodicity?: number
    periodicity_min: number
    periodicity_hour: number
    periodicity_day: number
    label: string
    boundary: string
    active: boolean
    tags: number[]
}

/**
 * @openapi
 * components:
 *   schemas:
 *     RecordDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         url:
 *           type: string
 *           example: http://www.example.com
 *         boundary:
 *           type: string
 *           example: /example.com/
 *         periodicity:
 *           type: number
 *           example: 60
 *         periodicity_min:
 *           type: number
 *           minimum: 0
 *           maximum: 60
 *           example: 42
 *         periodicity_hour:
 *           type: number
 *           minimum: 0
 *           maximum: 23
 *           example: 12
 *         periodicity_day:
 *           type: number
 *           minimum: 0
 *           maximum: 365
 *           example: 1
 *         label:
 *           type: string
 *           example: Example
 *         active:
 *           type: bool
 *           example: true 
 *         tags:
 *          type: array
 *          items:
 *             $ref: "#/components/schemas/TagDTO"
 */
export type RecordDTO = {
    id: number
    url: string
    periodicity_min: number
    periodicity_hour: number
    periodicity_day: number
    label: string
    boundary: string
    active: boolean
    tags: TagDTO[]
}

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateRecordDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         url:
 *           type: string
 *           example: http://www.example.com
 *         boundary:
 *           type: string
 *           example: /example.com/
 *         periodicity:
 *           type: number
 *           example: 60
 *         periodicity_min:
 *           type: number
 *           minimum: 0
 *           maximum: 60
 *           example: 42
 *         periodicity_hour:
 *           type: number
 *           minimum: 0
 *           maximum: 23
 *           example: 12
 *         periodicity_day:
 *           type: number
 *           minimum: 0
 *           maximum: 365
 *           example: 1
 *         label:
 *           type: string
 *           example: Example
 *         active:
 *           type: bool
 *           example: true 
 *         tags:
 *          type: array
 *          items:
 *              type: number
 *          description: Ids of all current tags
 */
export type UpdateRecordDTO = {
    id: number
    url: string
    periodicity_min: number
    periodicity_hour: number
    periodicity_day: number
    label: string
    boundary: string
    active: boolean
    tags: number[]
}

/**
 * @openapi
 * components:
 *   schemas:
 *     TagDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         name:
 *           type: string
 *           example: tag
 *           minLength: 3
 *           maxLength: 10
 *         color:
 *           type: string
 *           example: #FF5733
 */
export type TagDTO = {
    id: number
    name: string
    color: string
}
/**
 * @openapi
 * components:
 *   schemas:
 *     TagCreationDTO:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: tag
 *           minLength: 3
 *           maxLength: 10
 *         color:
 *           type: string
 *           example: #FF5733
 */
export type TagCreationDTO = {
    name: string
    color: string
}

export type CUD_DTO = {
    success: boolean
}

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateExecutionsDTO:
 *       type: object
 *       properties:
 *         creation:
 *           type: string
 *           format: date-time
 *           description: The date of creation for the execution.
 *         isTimed:
 *           type: boolean
 *           description: Indicates whether the execution is timed.
 *         recordId:
 *           type: integer
 *           description: The ID of the associated record for the execution.
 *       required:
 *         - creation
 *         - isTimed
 *         - recordId
 */
export type CreateExecutionsDTO = {
    creation: Date
    isTimed: boolean
    recordId: number
}


/**
 * @swagger
 * components:
 *   schemas:
 *     ExecutionDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique ID of the execution.
 *         creation:
 *           type: string
 *           format: date-time
 *           description: The date of creation for the execution.
 *         executionStart:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: The date when the execution started (can be null until it starts).
 *         executionDuration:
 *           type: number
 *           description: The duration of the execution in seconds.
 *         state:
 *           type: string
 *           enum:
 *             - created
 *             - planned
 *             - waiting
 *             - running
 *             - incomplete
 *             - canceled
 *             - done
 *           description: The state of the execution.
 *         isTimed:
 *           type: boolean
 *           description: Indicates whether the execution is timed.
 *         recordId:
 *           type: integer
 *           description: The ID of the associated record for the execution.
 *       required:
 *         - id
 *         - creation
 *         - executionDuration
 *         - state
 *         - isTimed
 *         - recordId
 */
export type ExecutionDTO = {
    id: number
    creation: Date
    executionStart: Date | null // can be null until the execution starts
    executionDuration: number
    state: string
    isTimed: boolean
    recordId: number
}


/**
 * @swagger
 * components:
 *   schemas:
 *     ExecutionWithRecordDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique ID of the execution.
 *         creation:
 *           type: string
 *           format: date-time
 *           description: The date of creation for the execution.
 *         executionStart:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: The date when the execution started (can be null until it starts).
 *         executionDuration:
 *           type: number
 *           description: The duration of the execution in seconds.
 *         state:
 *           type: string
 *           enum:
 *             - created
 *             - planned
 *             - waiting
 *             - running
 *             - incomplete
 *             - canceled
 *             - done
 *           description: The state of the execution.
 *         isTimed:
 *           type: boolean
 *           description: Indicates whether the execution is timed.
 *         recordId:
 *           $ref: "#/components/schemas/RecordDTO"
 *       required:
 *         - id
 *         - creation
 *         - executionDuration
 *         - state
 *         - isTimed
 *         - recordId
 */
export type ExecutionWithRecordDTO = {
    id: number
    creation: Date
    executionStart: Date | null // can be null until the execution starts
    executionDuration: number
    state: string
    isTimed: boolean
    recordId: RecordDTO
}


// todo: use as standard response??
export interface CRUDResult<T = any> {
    success: boolean
    payload?: T
}