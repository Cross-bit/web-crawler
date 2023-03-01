

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
    creation: Date
    executionStart: Date | null // can be null until the execution starts
    executionDuration: number
    state: string
    isTimed: boolean
    recordId: number
}

export interface GetExecutionsDataFilter {
    state?: string
    isTimed?: boolean
    recordId?: number   
}

export interface ExecutionNode {
    id?: number
    titile: string
    url: string
    crawlTime: string
    recordId: number
}

export interface ExecutionNodeConnections {
    id?: number
    NodeIdFrom: number
    NodeIdTo: number
}