

// APIs database abstractions

export interface RecordTagsRelationCreation {
    record_id: number
    tag_id: number
}

export interface RecordTagsRelation {
    id?: number
    recordId: number
    tagId: number
}

export interface TagData {
    id: number
    name: string
}

export interface RecordData {
    id: number
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
    active?: boolean // todo fix ??
    tags?: RecordTagsRelation[] | number[]
}


export interface ExecutionData {
    id?: number
    creation: string
    executionStart: string
    executionTime: string
    status: string
    isTimed: boolean
    record?: RecordDataPartial
}

export interface CRUDResult<T = any> {
    success: boolean
    error?: string
    message?: string
    payload?: T
}