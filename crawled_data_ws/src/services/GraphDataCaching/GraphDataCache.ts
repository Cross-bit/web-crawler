import { ExecutionNode } from "../../database/interface"

class GraphDataCache
{

    nodesCache: Map<number, Map<number, ExecutionNode>>;
    edgesCache: Map<number, Map<number,number>>;

    constructor() {
        this.nodesCache = new Map();
        this.edgesCache = new Map();
    }

    hasData(recordId: number) {

    }

    addNode(recordId: number, nodeData: ExecutionNode) {

    }

    addEdge(recordId: number, nodeId1: number, nodeId2: number) {

    }

    getData(recordId:number) {
        
    }
}
