
export type GenerateOptionsDTO = {
    randomContent: boolean 
    graphOptions?: RandomGraphOptions
}


export interface RandomGraphOptions {
    multigraph: boolean
    identity: boolean
    initialTreeBranching: number;
}

export type NodeDTO = {
    id: number
    url?: string
}

export type EdgeDTO = {
    source: number
    target: number
}

export type GraphDataDTO = {
    nodes: NodeDTO[]
    edges: EdgeDTO[]
}


export type GrapDataAdjency = {
    node: {
        id: number
        edges: number[]
    }
}