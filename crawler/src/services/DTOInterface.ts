
import { executionState } from "../utils/enums";

// Here we define DTO's (Data transfer objects that API returns/accepts)

/** New record creation DTO (we want client to always send all the data) */
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

/** General record DTO for retrival */
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

/** Update record DTO, we always update complete record */
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

// todo:
export type TagDTO = {
    id: number
    name: string
    color: string
}

export type TagCreationDTO = {
    name: string
    color: string
}

export type CUD_DTO = {
    success: boolean
}

export type CreateExecutionsDTO = {
    creation: Date
    isTimed: boolean
    recordId: number
}

export type ExecutionDTO = {
    id: number
    creation: Date
    executionStart: Date | null // can be null until the execution starts
    executionDuration: number
    state: string
    isTimed: boolean
    recordId: number
}

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