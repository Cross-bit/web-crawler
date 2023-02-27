
// Here We have definitions of DTO (Data transfer objects that API returns)

import { UpdateRecordDocument } from "../database/hasuraAPI/graphql/generated";

/** New record creation DTO (we want client to always send all the data) */
export type CreateRecordDTO = {
    url: string;
    periodicity: number;
    label: string;
    boundary: string;
    active: boolean;
    tags: number[];
}

/** General record DTO for retrival */
export type RecordDTO = {
    id: number;
    url: string;
    periodicity: number;
    label: string;
    boundary: string;
    active: boolean;
    tags: TagDTO[];
}

/** Update record DTO, we always update complete record */
export type UpdateRecordDTO = {
    id: number;
    url: string;
    periodicity: number;
    label: string;
    boundary: string;
    active: boolean;
    tags: number[];
}

// todo:
export type TagDTO = {
    id: number
    name: string
}

export type TagCreationDTO = {
    name: string
}

export type CUD_DTO = {
    success: boolean
}

enum executionState = {  }


export type ExecutionDTOs = {
    startTime:
    state

}