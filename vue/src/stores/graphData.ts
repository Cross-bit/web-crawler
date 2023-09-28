import { defineStore } from "pinia";
import { api } from "../boot/axios"
import * as message from "../common/qusarNotify"
import * as cydagre from 'cytoscape-dagre';
import * as cytoscape from "cytoscape";
import nodeHtmlLabel from 'cytoscape-node-html-label';
import coseBilkent from 'cytoscape-cose-bilkent';
import expandCollapse from 'cytoscape-expand-collapse';
import { nodesApi } from "../boot/axios"
import { APIRecord } from "./records/records";
import Queue from "./graphDataQueue"
import { useConfirmDialog } from "@vueuse/core";
//import { EventEmitter } from 'stream';
//import { isGraph } from 'graphology-assertions';

export interface ExeNode 
{
    id: number
    title: string
    url: URL
    crawlTime: number
    recordId: number
    errors: string[]
}

export interface ExeEdge {
    id: number
    NodeIdFrom: number
    NodeIdTo: number
}

export default interface INewGraphDataDTO
{
    recordId: number,
    currentExecutionId: number,
    currentSequenceNumber: number,
    isFullyNew: boolean,
    nodesData: ExeNode[],
    edgesData: ExeEdge[]
}

type nodeId = number
type edgeId = number

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

class CurrentProcessingState
{
    lastNodeId: number | undefined;
    lastEdgeId: number | undefined;
    lastRecievedGraphData: INewGraphDataDTO;

    constructor() {
        this.lastNodeId = -1;
        this.lastEdgeId = -1;
        this.lastRecievedGraphData = null;
    }
}

class RenderGraphState
{
    currentRenderDetailGraph: cytoscape.Core;
    graphContainer: HTMLElement;
    collapsingAPI: any;

    constructor() {
        this.currentRenderDetailGraph = null;
        this.graphContainer = null;
        this.collapsingAPI = null;
    }
}

/**
 * This is the graph render state that is supposed to live
 * across different graphs. (it is not destroied when flush is called)
 */
class RenderGraphStatePersistant
{
    currentZoom: number;
    currentPan: cytoscape.Position;

    constructor() {
        this.currentZoom = null;
        this.currentPan = null;
    }
}

class GraphDataState
{
    firstNodeArrived: boolean;
    nodesInGraph: Map<nodeId, ExeNode>;
    unresolvedNodes: Map<nodeId, ExeNode>;
    unresolvedEdgesFrom: Map<nodeId, Map<edgeId, ExeEdge>>;
    unresolvedEdgesTo: Map<nodeId, Map<edgeId, ExeEdge>>;
    domainGraphNodes:  Set<string>;
 

    constructor() {
        
        this.firstNodeArrived = false;
        this.nodesInGraph = new Map();
        this.unresolvedNodes = new Map();
        this.unresolvedEdgesFrom = new Map();
        this.unresolvedEdgesTo = new Map();
        this.domainGraphNodes = new Set();
    
    }
}

/*
Type for processnig queue and adding element to the graph
*/
export interface GraphElement {
    isNode: boolean
    data: ExeNode | ExeEdge
}


export interface IGraphState {
    isLiveMode: boolean,
    isDomainView: boolean,
    isNodeDetailOpen: boolean,

    currentExecutionId: number,
    currentRecordState: APIRecord,

    currentGraphRecordId: number
    currentSequenceNumber: number,
        
    graphStatePersistant: RenderGraphStatePersistant,
    graphDataState: GraphDataState,
    renderGraphState: RenderGraphState,

    incommingData: Queue<INewGraphDataDTO>,

    //graphEventEmitter: EventEmitter,
    lastTappedNode: ExeNode,
    lastTappedNodesRecordArr: RecordData[],
    
    currentProcessingState: CurrentProcessingState,

    currentEventSource: EventSource

    buildedGraph: Map<number, Set<number>> // this is the testing graph that should be build

    processingQueue: Queue<GraphElement>
    processingIntervalId: number
}

export const useGraphsDataStore = defineStore('graphData', {
    state: (): IGraphState => ({
        isLiveMode: false,
        graphDataState: new GraphDataState(),
        renderGraphState: new RenderGraphState(),
        currentProcessingState: new CurrentProcessingState(),
        graphStatePersistant: new RenderGraphStatePersistant(),
        currentGraphRecordId: -1,
        lastTappedNode: null,
        lastTappedNodesRecordArr: [],
        currentRecordState: null,
        currentExecutionId: -1,
        currentSequenceNumber: -1,
        isNodeDetailOpen: false,
        isDomainView: false,
        currentEventSource: null,
        incommingData: new Queue<INewGraphDataDTO>(),

        buildedGraph: new Map<number, Set<number>>(),

        processingQueue: new Queue<GraphElement>(),
        processingIntervalId: -1

    }),
    getters: {
        getAllNodes() {
            return;
        },
        nodeData() {
            return;
        },
        hasGraphdata: (state) => {
            if (!state.graphDataState){
                return false;
            }
            return state.graphDataState.nodesInGraph.size > 0
        },
        renderGraphLayout()
        {
            return {
                name: 'dagre',//cose-bilkent
                animate: false,
                idealEdgeLength: 100,
                nodeDimensionsIncludeLabels: true,
                fit: true,
                pan: { x: 500, y: 300 }, //TODO: set properly!!!
                zoom: 0.4,
            };
        },
        renderGraphNodeCss() {
            return {
                shape: "roundrectangle",
                height: 50,
                width: (node) => node.data('name').length * 10,
                'background-color': (node) => {

                    const nodeUrl = node.data('name');
                    
                    if (nodeUrl == this.currentRecordState.url){
                        return 'palegreen';
                    }

                    if (!node.data('isDomainNode'))
                    {
                        const errors = node.data('errors');

                        if (errors?.includes('extension')) {
                            return 'lightskyblue';
                        }

                        return errors?.includes('ok') ? 'white' : 'lightcoral';
                    }


                    return 'white';
                },
                'color': 'black',// (node) => (node.data('errors')?.includes('ok') ? "black" : "blue"),
                'font-weight': 'bold',
                'border-color': (node) =>{

                    const nodeUrl = node.data('name');

                    if (!node.data('isDomainNode'))
                    {
                        const errors = node.data('errors');
                        
                        if (nodeUrl == this.currentRecordState.url){
                            return 'limegreen';
                        }

                        if (errors?.includes('extension')) {
                            return 'cornflowerblue';
                        }
                        

                        return errors?.includes('ok') ? 'black' : 'indianred';
                    }
                    else
                        return 'lightgray';

                },
                "border-width": (node) => node.data('isDomainNode') ? 2 : 3,
                "border-radius": 4,
                'border-style': (node) => {

                    return node.data('isDomainNode') ? 'dashed' : 'solid';
                },
                content: "data(name)",
                "text-wrap": "wrap",
                "text-valign": (node) => node.data('isDomainNode') ? 'top' : 'center',
                "text-halign": "center",
                'padding': (node) =>
                {   
                    if (!this.isDomainView)
                        return node.data('isDomainNode') ? 100 : 0
                    else
                        return  5;
                }
            };
        },
        renderGraphEdgeCss() {
            return {
                label: "data(label)",
                "text-outline-color": "white",
                "text-outline-width": 3,
                "text-valign": "top",
                "text-halign": "left",
                "curve-style": "bezier",
                width: 3,
                "target-arrow-shape": "triangle",
                "line-color": "gray",
                "target-arrow-color": "gray",
              };
        },
        selfLoopEdgeCss() {
            return {            
                    'loop-direction': '0deg', 
                    'loop-sweep': '60deg',
                    'target-endpoint': '60deg',
                    'source-endpoint': '240deg',
                    'control-point-step-size': '40',
                    
                }
        }
    },
    actions: {
        async connectToGraphDataSSE(recordData: APIRecord) {
            console.log("what is the state");
            console.log(this.currentEventSource?.readyState);

            if (this.currentEventSource && (this.currentEventSource.readyState === EventSource.OPEN 
            || this.currentEventSource.readyState === EventSource.CONNECTING))
                return; // If we already are connected... return...
        
            
            this.currentRecordState = recordData;
            const procState = this.currentProcessingState;

            const lastNodeId = procState.lastNodeId;
            const lastEdgeId = procState.lastEdgeId;
            console.log(lastNodeId);
            console.log(lastEdgeId);
            
            const servicePort = (process.env.GRAPH_READ_SERVICE_PORT || 5500)
            let reqUrl = `http://localhost:${servicePort}/api/v1/sseGraphData/${recordData.id}?`
            reqUrl += `executionId=${this.currentExecutionId}`
            reqUrl += `sequenceNumber=${this.currentExecutionId}`
            reqUrl += lastNodeId > -1 ? `&nodeId=${lastNodeId}` : '';
            reqUrl += lastEdgeId > -1 ? `&edgeId=${lastEdgeId}` : '';
            console.log(reqUrl);
            

            this.currentEventSource = new EventSource(reqUrl);
            this.currentEventSource.onopen = () => console.log('Connection opened');
            this.currentEventSource.onerror = (error) => console.log(error);
            this.currentEventSource.onmessage = (event) => this.onNewGraphDataUpdate(event.data);

            setTimeout(() => {
                if (!this.isLiveMode){
                    this.disconnectFromGraphDataSSE();
                    
                    for (const [nodeID, followers] of this.buildedGraph) {
                        const followerList = [...followers].join(', ');
                        console.log(`${nodeID}: ${followerList}`);
                    }
                    console.log(this.graphDataState.unresolvedEdgesFrom);

                    console.log(this.renderGraphState.currentRenderDetailGraph.edges());
                }
                }, 5000);
        },
        flushGraphData() {
            console.log("G flushed");
            
            this.graphDataState = new GraphDataState();
            this.currentProcessingState = new CurrentProcessingState();
            this.renderGraphState = new RenderGraphState();
            this.lastTappedNode = null;
            this.lastTappedNodesRecordArr = [];
            this.currentExecutionId = -1;
            this.isNodeDetailOpen = false;
            this.isDomainView = false;

            this.buildedGraph = new Map();

            this.incommingData = new Queue<INewGraphDataDTO>()

            this.processingQueue = new Queue<GraphElement>()

            if (this.processingIntervalId != -1) {
                console.log("cleared interrval");
                clearInterval(this.processingIntervalId);
                this.processingIntervalId = -1;
            }

        },
        async disconnectFromGraphDataSSE() {
            console.log("Graph data connection Closed");

            if (this.currentEventSource)
            {
                this.currentEventSource.onopen = null;
                this.currentEventSource.onerror = null;
                this.currentEventSource.onmessage = null;
                this.currentEventSource.close();
            }
        },
        async onNewGraphDataUpdate(data)  {

            
        const procState = this.currentProcessingState;
        procState.lastRecievedGraphData = JSON.parse(data) as INewGraphDataDTO;
        
        console.log(`data r.id: ${procState.lastRecievedGraphData.recordId} cur r.id: ${this.currentGraphRecordId}`);
        if (procState.lastRecievedGraphData.recordId != this.currentGraphRecordId) {
            return; // If the data are not for "us", we reject them immediatelly.
        }
        
        console.log(procState.lastRecievedGraphData.currentExecutionId);
        console.log("sequence number: ");
        console.log(procState.lastRecievedGraphData.currentSequenceNumber);
        console.log(this.currentExecutionId);

        if (this.currentSequenceNumber != procState.lastRecievedGraphData.currentSequenceNumber)
        {
            console.log("flushed g data because data with exe id newer arrived ");
            const graphContainerTmp = this.renderGraphState.graphContainer;
            this.flushGraphData();
            this.initiateRenderGraph(graphContainerTmp);

        }

        this.currentSequenceNumber = procState.lastRecievedGraphData.currentSequenceNumber;
        console.log("tady update sequence number");
        console.log(this.currentSequenceNumber);

        this.currentExecutionId = procState.lastRecievedGraphData.currentExecutionId;
        console.log("tady update exe id");
        console.log(this.currentExecutionId);

        
        if (this.processingIntervalId == -1) {
            console.log("setting itnerval");
            //this.updateElementProcessing
            this.processingIntervalId = setInterval(this.updateElementProcessing, 250);
        }


        let nodesCtr = 0;

        procState.lastRecievedGraphData.nodesData.forEach(nodeData => {

            const nodeTimeoutId = setTimeout(() => {
                    nodesCtr++;
                    const nodeDataParsed = {
                        ...nodeData,
                        url: new URL(nodeData.url)
                    } as ExeNode
                    
                    if (nodesCtr == 1) { // we bootstrap the algorithm by adding initial node
                        this.graphDataState.nodesInGraph.set(nodeDataParsed.id, nodeDataParsed);
                        this.buildedGraph.set(nodeDataParsed.id, new Set());
                        this.addNodeToGraph(nodeDataParsed);
                        return;
                    }
                    
                    this.addNode(nodeDataParsed);
                    clearTimeout(nodeTimeoutId);
                }, 100)
        });

        procState.lastRecievedGraphData.edgesData.forEach(edgeData => {           
            const edgeTimeoutId = setTimeout(() => {
                    this.addEdge(edgeData);
                    clearTimeout(edgeTimeoutId);
                }, 100)
        });

        },
        /*
        *
        * Updating and managing continous graph creation
        *
        */
        updateElementProcessing() {
            const procQueue: Queue<GraphElement> = this.processingQueue;
            console.log("callded" + procQueue.size());
            if (procQueue.size() > 0) {

                const nextElement: GraphElement = procQueue.dequeue();

                if (nextElement.isNode) {
                    this.addNodeToGraph(nextElement.data);
                }
                else {
                    this.addEdgeToGraph(nextElement.data);
                }
            }
        },
        /**
         * Adds new node to the continously constructed graph. 
         * Also recurively tries to add all neighbours that can be resolved.
         * @param node Execution node to add
         * @returns void
         */    
        addNode(node: ExeNode) {
            const gState: GraphDataState = this.graphDataState;
            /*console.log("adding node");
            console.log(node);*/

            // If we recurse on visited we delete, otherwise nothing happens
            gState.unresolvedNodes.delete(node.id);

            // We find all incident edges, that are not in the graph yet, but we have them

            // all edges FROM the node
            const incidendEdgesFrom = gState.unresolvedEdgesFrom.get(node.id);

            // all edges TO the node
            const incidendEdgesTo = gState.unresolvedEdgesTo.get(node.id);

            // we have 3 groups of incident edges
            // a) Neighbour already in the graph
            // b) Neighbour in unresolved (but we have it)
            // c) We dont have neighbour
            const aEdgesFrom: ExeEdge[] = [];
            const bEdgesFrom: ExeEdge[] = [];

            if (incidendEdgesFrom)
            for (const [neighbourID, edge] of incidendEdgesFrom) {
                // this is a) case
                if (gState.nodesInGraph.has(neighbourID)) {
                    aEdgesFrom.push(edge);
                } // this is b) case => note invariant a), b) can never occure at the same time
                else if (gState.unresolvedNodes.has(neighbourID)) {
                    bEdgesFrom.push(edge);
                }
                // this is c) case, and since we don't have this node yet we do nothing.
            }

            const aEdgesTo: ExeEdge[] = [];
            const bEdgesTo: ExeEdge[] = [];

            if (incidendEdgesTo)
            for (const [neighbourID, edge] of incidendEdgesTo) {
                // this is a) case
                if (gState.nodesInGraph.has(neighbourID)) {
                    aEdgesTo.push(edge);
                } // this is b) case => note invariant a), b) can never occure at the same time
                else if (gState.unresolvedNodes.has(neighbourID)) {
                    bEdgesTo.push(edge);
                }
                // this is c) case, and since we don't have this node yet we do nothing.
            }

            // There is a neighbour node in the graph, to which we can connect our new node; well firstly we add the node
            if (aEdgesFrom.length > 0 || aEdgesTo.length > 0) {
                if (!gState.nodesInGraph.has(node.id) ){
                    gState.nodesInGraph.set(node.id, node);
                    
                    //this.addNodeToGraph(node);

                    this.enqueueNode(node);

                    // for testing purposes:
                    this.buildedGraph.set(node.id, new Set()); 
                }
            }
            else {
                // Otherwise we add the node to unvisited and we are done
                gState.unresolvedNodes.set(node.id, node);
                return;
            }

            // If node.id has incidnet edge from && to it self, it has to be identity and since we added the node now, we can add also this edge.
            if (incidendEdgesTo && incidendEdgesFrom && incidendEdgesTo.has(node.id) && incidendEdgesFrom.has(node.id)) {
                //this.addEdgeToGraph(incidendEdgesTo.has(node.id));*/
                this.buildedGraph.get(node.id).add(node.id);
            }

            // Now we step to adding edges
            
            // We add all edges going FROM the added node that can be added, since neighbours are in the graph already
            for (const edgeInGraph of aEdgesFrom) {

                this.enqueueEdge(edgeInGraph);

                //this.addEdgeToGraph(edgeInGraph);
                // for testing purposes
                this.buildedGraph.get(node.id).add(edgeInGraph.NodeIdTo); // NodeIdFrom?
            }

            // We add all edges goint in-TO the added node that can be added, since neighbours are in the graph already
            for (const edgeInGraph of aEdgesTo) {
                // for testing purposes
                //this.addEdgeToGraph(edgeInGraph);
                this.enqueueEdge(edgeInGraph);

                this.buildedGraph.get(edgeInGraph.NodeIdFrom).add(node.id);
            }


            // Now as the last step, we can recurse this procedure and try to add all nodes that now has new neighbour (the newly added node)
            for (const edgeToFriendNotInGraph of bEdgesTo) {
                // We get the friend
                const neighbour = gState.unresolvedNodes.get(edgeToFriendNotInGraph.NodeIdFrom);

                this.addNode(neighbour); // and we recurse
            }

            for (const edgeToFriendNotInGraph of bEdgesFrom) {
                // We get the friend
                const neighbour = gState.unresolvedNodes.get(edgeToFriendNotInGraph.NodeIdTo);

                this.addNode(neighbour); // and we recurse
            }



        },
        /**
         * Adds new edge to the continously created graph if it is possible(if it wouldn't break the continuity).
         * Also calls AddNode for the nodes that would be incident with this new edge and are possible to add.
         * @param edge Execution edge to add
         */
        addEdge(edge: ExeEdge) {
            const gState: GraphDataState = this.graphDataState;

            /*console.log("adding edge");
            console.log(edge);*/

            // we add new edge to oracle
            if (!gState.unresolvedEdgesFrom.has(edge.NodeIdFrom))
                gState.unresolvedEdgesFrom.set(edge.NodeIdFrom, new Map());
            
            const eRecordFrom = gState.unresolvedEdgesFrom.get(edge.NodeIdFrom);
            eRecordFrom.set(edge.NodeIdTo, edge);

            if (!gState.unresolvedEdgesTo.has(edge.NodeIdTo))
                gState.unresolvedEdgesTo.set(edge.NodeIdTo, new Map());
        
            const eRecordTo = gState.unresolvedEdgesTo.get(edge.NodeIdTo);
            eRecordTo.set(edge.NodeIdFrom, edge);

            
            // Now we can try to add the edge

            // Both end nodes are in the graph, in this case, we can directly add the edge without any concerns
            if (gState.nodesInGraph.has(edge.NodeIdFrom) && gState.nodesInGraph.has(edge.NodeIdTo)) {
                //this.addEdgeToGraph(edge); TODO: add for real
                this.enqueueEdge(edge);
                //this.addEdgeToGraph(edge);



                this.buildedGraph.get(edge.NodeIdFrom).add(edge.NodeIdTo);
            }
            else if (gState.nodesInGraph.has(edge.NodeIdFrom) && this.graphDataState.unresolvedNodes.has(edge.NodeIdTo)) {

                const neighbourTo = gState.unresolvedNodes.get(edge.NodeIdTo);

                // We add friend TO which is the new edge going but is not in the graph yet
                this.addNode(neighbourTo);

            }
            else if (gState.nodesInGraph.has(edge.NodeIdTo) && this.graphDataState.unresolvedNodes.has(edge.NodeIdFrom))
            {
                const neighbourFrom = gState.unresolvedNodes.get(edge.NodeIdFrom);

                // We add friend FROM which is the new edge going but is not in the graph yet
                this.addNode(neighbourFrom);

            }
            // Else we don't have any end nodes yet so we can't do much

        },
        enqueueNode(node: ExeNode){
            this.processingQueue.enqueue({
                isNode: true,
                data: node
            });

        },
        enqueueEdge(edge: ExeEdge) {
            this.processingQueue.enqueue({
                isNode: false,
                data: edge
            });
        },

        /*
        *
        * Updating rendered Graph 
        *
        */

        addNodeToGraph(nodeData: ExeNode)  {
            
            //const gState = this.graphDataState;
            const gRenderCy: cytoscape.Core = this.renderGraphState.currentRenderDetailGraph;

            this.graphDataState.nodesInGraph.set(nodeData.id, nodeData);
            this.graphDataState.unresolvedNodes.delete(nodeData.id);

            // first we try to add domain 
            const parentId = this.categorizeNewNodeToDomain(nodeData)
          
            gRenderCy.add({
                    group: 'nodes',
                    data: {
                        id: nodeData.id.toString(),
                        name: nodeData.url.toString(),
                        errors: nodeData.errors,
                        crawlTime: nodeData.crawlTime,
                        parent: parentId,
                        isDomainNode: false,                    
                    },
            })

            this.graphStatePersistant.currentZoom = gRenderCy.zoom();
            this.graphStatePersistant.currentPan = gRenderCy.pan();
            
            const layout = gRenderCy.makeLayout(
                this.renderGraphLayout
            );

           layout.run();

            // we also have to update the collapsing api so it works
            // after new insertion
            this.updateCollapsingAPI();

            gRenderCy.zoom(this.graphStatePersistant.currentZoom);
            gRenderCy.pan(this.graphStatePersistant.currentPan);


            this.updateLastNodeId(nodeData.id);
            
        },
        addEdgeToGraph(edgesData: ExeEdge) {

            if (edgesData.NodeIdFrom == edgesData.NodeIdTo)
                console.log("identity inserted");

            this.renderGraphState.currentRenderDetailGraph.add({
                
                group: 'edges',
                data: {
                    id: `edge-${edgesData.id.toString()}`,
                    source: edgesData.NodeIdFrom.toString(),
                    target: edgesData.NodeIdTo.toString(),
                },
                classes: edgesData.NodeIdFrom == edgesData.NodeIdTo ? 'identity' : '',
            })

            this.updateLastEdgeId(edgesData.id);
        },
        categorizeNewNodeToDomain(node: ExeNode) { 

            const hostname = node.url.hostname ? node.url.hostname : node.url.toString();
            

            if (!this.graphDataState.domainGraphNodes.has(hostname)) {

                // we add new parent node
                this.renderGraphState.currentRenderDetailGraph.add({
                    group: 'nodes',
                    data: {
                        id: hostname,
                        name: hostname,
                        isDomainNode: true,
                    }
                })

                this.graphDataState.domainGraphNodes.add(hostname);
            }

            return hostname;
            
        },
        updateLastNodeId(newNodeId: number) {
            const procState = this.currentProcessingState;
            if (newNodeId > procState.lastNodeId)
                procState.lastNodeId = newNodeId;
        },
        updateLastEdgeId(newEdgeId: number)
        {
            const procState = this.currentProcessingState;
            if (newEdgeId > procState.lastEdgeId)
                procState.lastEdgeId = newEdgeId;
        },

        /*
        *
        * Initialisation of new rendered Graph 
        *
        */

        initiateLinkRenderGraph(graphContainer: HTMLElement) {   
            console.log("here initialising");
            this.renderGraphState.currentRenderDetailGraph = cytoscape({
                container: graphContainer,
                boxSelectionEnabled: false,
                autounselectify: true,
                wheelSensitivity: 0.5,
                minZoom: 0.08,
                maxZoom: 1.7,

                layout: this.renderGraphLayout,
                style: cytoscape
                  .stylesheet()
                  .selector('node')
                  .css(this.renderGraphNodeCss)
                  .selector('edge')
                  .css(this.renderGraphEdgeCss)
                  .selector('.identity')
                  .css(this.selfLoopEdgeCss)
            });

            
            if (this.graphStatePersistant.currentZoom){
                console.log("helllo");
                this.renderGraphState.currentRenderDetailGraph.zoom(this.graphStatePersistant.currentZoom);
            }
            if (this.graphStatePersistant.currentPan)
             this.renderGraphState.currentRenderDetailGraph.pan(this.graphStatePersistant.currentPan);

            // TODO: add execution btn properly
            /*this.renderGraphState.currentRenderDetailGraph.nodeHtmlLabel([
            {
                query: "node",
                halign: "center",
                valign: "right",
                halignBox: "right",
                valignBox: "right",
                tpl: function (data) {
                return !data.isGroupNode ? `
                    <Button>play</Button>
                ` : "";
                }
            }]);*/

            let lastTapTime = 0;
            let lastTappedNode = null;
            
            this.renderGraphState.currentRenderDetailGraph.on('tap', 'node', event => {
              const currentTime = new Date().getTime();
              const currenTappedtNode = event.target;
              const delay = currentTime - lastTapTime;
          
              if (lastTappedNode === currenTappedtNode && delay < 300) {
                
                this.onNodeDoubleTapped(Number(currenTappedtNode.id()));

              } else {
                // Single tap/click action
                lastTappedNode = currenTappedtNode;
              }
          
              lastTapTime = currentTime;
            });

            this.renderGraphState.collapsingAPI = this.renderGraphState.currentRenderDetailGraph.expandCollapse('get');
        },
        initiateRenderGraph(linkGraphContainer: HTMLElement)
        {

            // // inititalize custom layouts
            cytoscape.use( coseBilkent );

            // inititalize plugins

            if (typeof cytoscape('core', 'cydagre') === 'undefined') {
                cydagre(cytoscape);
            }

            if (typeof cytoscape('core', 'expandCollapse') === 'undefined') {
                expandCollapse(cytoscape)
            }

            if (typeof cytoscape('core', 'nodeHtmlLabel') === 'undefined') {
                nodeHtmlLabel(cytoscape);
            }

            this.renderGraphState.graphContainer = linkGraphContainer;
            this.initiateLinkRenderGraph(linkGraphContainer);

            /*if (this.renderGraphState.currentRenderDetailGraph){

                if (this.graphStatePersistant.currentZoom)
                    this.renderGraphState.currentRenderDetailGraph.zoom(this.graphStatePersistant.currentZoom);
                if (this.graphStatePersistant.currentPan)
                    this.renderGraphState.currentRenderDetailGraph.pan(this.graphStatePersistant.currentPan);
            }*/


            this.updateRenderedGraph();
        },

        /*
        *
        * Graph render utils
        *
        */

        updateCollapsingAPI() {
            
            this.renderGraphState.collapsingAPI = this.renderGraphState.currentRenderDetailGraph.expandCollapse({       
                layoutBy: {
                  name: 'dagre', // cose-bilkent
                  animate: false,
                  randomize: false,
                  idealEdgeLength: 300,
                  numIter: 2000,
                  fit: false
                  
                },
                nodeRepulsion: 4000,
                fisheye: true,
                animate: false,
                undoable: false,
              });
            

              this.updateRenderedGraph();


        },
        async onNodeDoubleTapped(nodeId: number)
        {
            const nodeData = this.graphDataState.nodesInGraph?.get(nodeId);
            this.lastTappedNode = nodeData;
            this.isNodeDetailOpen = true;
            
            try {
                const endpointUrl = '/nodes/' + encodeURIComponent(this.lastTappedNode.url.toString()) + '/records';

                const response = await nodesApi.get(endpointUrl)
                this.lastTappedNodesRecordArr = response.data;
                console.log(this.lastTappedNodesRecordArr);
            }
            catch(error) {
                message.error("Records couldn't be synchronized, due to internal server error.");
                console.error(error);
            }

            
            return nodeData;
        },
        updateRenderedGraph() {
            
            if (!this.renderGraphState.graphContainer) {
                console.error("link graph container hasn't been set");
                return;
            }
            
            if (this.isDomainView) {
                console.log(this.renderGraphState.collapsingAPI);
                this.renderGraphState.collapsingAPI?.collapseAll();
            }
            else {   
                console.log(this.renderGraphState.collapsingAPI);
                this.renderGraphState.collapsingAPI?.expandAll();
            }
        }
    }
});