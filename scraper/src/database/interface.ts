

// APIs database abstractions
// In order to maintain some order, these interfaces are ment for data of the request => going IN. (the response is wildwest based on the packages used)

export interface RecordTagsRelationCreation {
    record_id: number,
    tag_id: number
}

export interface RecordCreation {
    url: string,
    periodicity: number,
    label: string
    boundary: string
    active: boolean
}