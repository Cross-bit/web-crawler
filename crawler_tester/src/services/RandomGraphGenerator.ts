import { DirectedGraph, UndirectedGraph } from 'graphology';
import {EdgeDTO, GraphDataDTO, NodeDTO, RandomGraphOptions} from './interface'


class RandomGraphGenerator
{

    nodesCount: number;
    edgesCount: number;
    options: RandomGraphOptions;

    graph: DirectedGraph;

    constructor(nodesCount:number, edgesCount: number, options: RandomGraphOptions) {
        this.nodesCount =  nodesCount;
        this.edgesCount = edgesCount;
        this.options = options;
        this.graph = new DirectedGraph();
    }

    public Generate = () => {
        this.GenerateTree();
    }

    public GetGraphDTO = (): GraphDataDTO => {

        const jsonRepresentation = this.graph.toJSON();


        const nodesData =  jsonRepresentation.nodes.map((nodeData) => ({
            id: +nodeData.key
        } as NodeDTO));

        const edgesData = jsonRepresentation.edges.map((edgeData) => ({
            source: +edgeData.source,
            target: +edgeData.target
        } as EdgeDTO))

        
        return { nodes: nodesData, edges: edgesData } as GraphDataDTO;
    }

    private GenerateTree = () => {
        let numOfNodes = this.nodesCount;
        const bfsQueue:number[] = [];

        bfsQueue.push(0); // i wanted the root to be indexed 0... and then numbered from left to right
        this.graph.addNode(0);
        numOfNodes--;

        while (bfsQueue.length > 0 && numOfNodes > 0) { // we still have more children to add
            const currentNode = bfsQueue.shift();
            //console.log(currentNode);
            let branching = Math.max(Math.floor(Math.random() * this.options.initialTreeBranching), 1);

            //console.log("branching: "+ branching);
            while (branching > 0 && numOfNodes > 0) {
                const nextNodeNum = (this.nodesCount - numOfNodes)
                //console.log(nextNodeNum);
                // add new child to graph
                this.graph.addNode(nextNodeNum);

                // add it to queue
                bfsQueue.push(nextNodeNum);
                
                // add edge to new child
                this.graph.addEdge(currentNode, nextNodeNum);

                numOfNodes--;
                branching--;
            }
        }


    }
}

export default RandomGraphGenerator;
