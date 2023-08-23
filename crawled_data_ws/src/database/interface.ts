
export interface ExecutionNode {
    id: number
    title: string
    url: string
    crawlTime: number
    recordId: number
}

export interface ExecutionNodeWithErrors extends ExecutionNode {
    errors: string[]
}

export interface ExecutionNodeConnections {
    id?: number
    NodeIdFrom: number
    NodeIdTo: number
}


