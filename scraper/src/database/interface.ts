

// APIs database abstractions
// In order to maintain some order, these interfaces are ment for data of the request => going IN. (the response is wildwest based on the packages used)

export interface RecordTagsRelationCreation {
    record_id: number,
    tag_id: number
}

export interface RecordData {
    id?: number
    url: string
    periodicity: number
    label: string
    boundary: string
    active: boolean
}

export interface RecordDataPartial extends Partial<RecordData> {
    id?: number
    url?: string
    periodicity?: number
    label?: string
    boundary?: string
    active?: boolean // todo fix ?? XD
}


export interface ExecutionData {
    id?: number
    creation: string
    execution_start: string
    execution_time: string
    status: string
    isTimed: boolean
    record?: RecordDataPartial
}