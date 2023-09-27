

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
    color: string
}

export interface TagInsertion {
    name: string
    color: string
}

export interface RecordData {
    id: number
    url: string
    periodicity_min: number,
    periodicity_hour: number,
    periodicity_day: number,
    label: string
    boundary: string
    active: boolean
}

export interface RecordDataWithTags extends RecordData {
    tags: TagData[]
}

export interface RecordDataPartial extends Partial<RecordData> {
    id?: number
    url?: string
    periodicity_min?: number,
    periodicity_hour?: number,
    periodicity_day?: number,
    label?: string
    boundary?: string
    active?: boolean // todo fix ??
    tags?: RecordTagsRelation[] | number[]
}

export interface ExecutionData {
    id?: number
    creation: Date
    executionStart: Date | null // can be null until the execution starts
    realExecutionStart: Date | null
    sequenceNumber: number | null
    executionDuration: number
    state: string
    isTimed: boolean
    recordId: number
}

export interface ExecutionDataWithRecord extends Omit<ExecutionData, 'recordId'> {
    record: RecordData
}

export interface ExecutionsDataFilter {
    executionIDs?: number[]
    state?: string[]
    isTimed?: boolean
    recordId?: number[]
}

export interface ExecutionNode {
    id?: number
    title: string
    url: string
    crawlTime: number
    recordId: number
}

export interface ExecutionNodeWithErrors extends ExecutionNode {
    errors: string[]
}

export enum NodeCrawlErrors { OK = 'ok', REGEX = 'regex', EXTENSION = 'extension', INVALID_URI = 'invalid_uri', DATA_DOWNLOAD = 'data_download' }

export interface UpdateExecutionNode {
    id: number
    title?: string
    crawlTime?: number
    // TODO: is depreceted... or smth like that ... 
}

export interface ExecutionNodeConnections {
    id?: number
    NodeIdFrom: number
    NodeIdTo: number
    recordId: number
}




// interfaces for database modules (wrappers for OOP)


export interface IDatabaseWrapper {
    ExecutionDatabase?: IExecutionsDatabase;
    RecordsDatabase?: IRecordsDatabase;
    NodesDatabase?: INodesDatabase;
    TagsDatabase?: ITagsDatabase;
}

export interface IExecutionsDatabase
{   
    GetExecutions(filter?: ExecutionsDataFilter): Promise<ExecutionData[]>;
    GetExecutionsWithRecord(filter?: ExecutionsDataFilter): Promise<ExecutionDataWithRecord[]>;
    insertExecution(execution: ExecutionData): Promise<number>;
    UpdateExecutionsState(newExecutionState: string, filter: ExecutionsDataFilter): Promise<ExecutionDataWithRecord[]>;
    UpdateExecutionsDuration(newExecutionDuration: number, filter: ExecutionsDataFilter): Promise<number[]>;
    UpdateExecutionsStartTime(realStartTime: Date, executionId: number): Promise<void>;
    UpdateExecutionOnExecutionStart(realStartTime: Date, executionId: number): Promise<void>;
}

export interface IRecordsDatabase {
    GetRecord(recordId: number) : Promise<RecordData>;
    GetAllRecords() : Promise<RecordData[]>;
    GetAllRecordsByIds(recordIDs: number[]) : Promise<RecordData[]>;
    DeleteRecord(recordId: number): Promise<void>;
    InsertNewRecord(data: RecordDataPartial): Promise<number>;
    InsertNewRecordsTagsRelations(recordId: number, tagIds: number[]): Promise<void>
    UpdateRecordData(recordData: RecordDataPartial): Promise<void>;
}

export interface ITagsDatabase
{
    InsertOneTag(tagName: string): Promise<number>;
    GetAllTags(): Promise<TagData[]>;
    GetAllTagsByRecordId(recordId: number) : Promise<TagData[]>;
}

export interface INodesDatabase
{      
    InsertNewNodesRelation(node1Id: number, node2Id: number, recordId: number): Promise<number>;
    InsertNewNode(nodeData: ExecutionNodeWithErrors): Promise<number>;
    GetNodesByRecordIdsQuery(recordId: number[]): Promise<ExecutionNodeWithErrors[]>;
    DeleteAllGraphDataByRecordId(recordId: number): Promise<void>;
    UpdateNodesQuery(dataToUpdate: UpdateExecutionNode): Promise<void>;
}
