

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
    state: string
    isTimed: boolean
    record?: RecordDataPartial
}

export interface CRUDResult<T = any> {
    success: boolean
    error?: string
    message?: string
    payload?: T
}


export enum executionState { CREATED, PLANNED, WAITING, RUNNING, INCOMPLETE, DONE }

/*
    'planned' – in execution queue, ready to be executed
    'waiting' – waiting in system(e.g. by cron) to be planned to execution queue
    'running' – is beeing executed
    'incomplete' – if smth fails during execution and is beeing terminated
    'done' – execution succesfully finished
*/

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