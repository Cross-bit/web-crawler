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
//import { EventEmitter } from 'stream';
//import { isGraph } from 'graphology-assertions';

export interface ExecutionNode 
{
    id: number
    title: string
    url: URL
    crawlTime: number
    recordId: number
    errors: string[]
}

export interface ExecutionNodesConnection {
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
    nodesData: ExecutionNode[],
    edgesData: ExecutionNodesConnection[]
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
    nodesInGraph: Map<nodeId, ExecutionNode>;
    unresolvedNodes: Map<nodeId, ExecutionNode>;
    unresolvedEdgesFrom: Map<nodeId, Map<edgeId, ExecutionNodesConnection>>;
    unresolvedEdgesTo: Map<nodeId, Map<edgeId, ExecutionNodesConnection>>;
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

/*export class CurrentRecordState
{
    // this is the url of the starting node where crawling starts
    baseUrl: string;
    currentGraphRecordId: number;

    constructor() {
        this.baseUrl = '';
        this.currentGraphRecordId = -1;
    }
}*/

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
    //graphEventEmitter: EventEmitter,
    lastTappedNode: ExecutionNode,
    lastTappedNodesRecordArr: RecordData[],
    
    currentProcessingState: CurrentProcessingState,

    currentEventSource: EventSource
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
                name: 'cose-bilkent',
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
                if (!this.isLiveMode)
                    this.disconnectFromGraphDataSSE()
                }, 5000);
        },
        flushGraphData() {
            console.log("flushed");
            
            this.graphDataState = new GraphDataState();
            this.currentProcessingState = new CurrentProcessingState();
            this.renderGraphState = new RenderGraphState();
            this.lastTappedNode = null;
            this.lastTappedNodesRecordArr = [];
            this.currentExecutionId = -1;
          //  this.currentGraphRecordId = -1;
            //this.currentRecordState = null;
            this.isNodeDetailOpen = false;
            this.isDomainView = false;
            
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

        //console.log(JSON.parse(data));

        let cc = 0;
        let bb = 0;
        
        const domainNames = [
            "domain1",
            /*"domain2",
            "domain3"*/
        ]

        procState.lastRecievedGraphData.nodesData.forEach(nodeData => {

            //console.log(nodeData);
            setTimeout(() => {

                    const nodeDataParsed = {
                        ...nodeData,
                        url: new URL(nodeData.url)
                    } as ExecutionNode


                    /*if(nodeDataParsed.id == 10 || nodeDataParsed.id == 9 || nodeDataParsed.id == 5){
                        nodeDataParsed.url.hostname = "domain3"
                    }

                    if(nodeDataParsed.id == 7 || nodeDataParsed.id == 6 || nodeDataParsed.id == 3){
                        nodeDataParsed.url.hostname = "domain2"
                    }*/


                    this.procecessNewNode(nodeDataParsed);
                }, bb * 10 /*+ (Math.random() < 0.5 ? -70 : 30)*/)
                bb++;
            });

            procState.lastRecievedGraphData.edgesData.forEach(edgeData => {
                
                setTimeout(() => {
                    this.procecessNewEdge(edgeData);
                    console.log(edgeData);
                }, cc * 500/* + (Math.random() < 0.5 ? -20 : 90)*/)
                cc++;
            });

        },

        async procecessNewNode(node: ExecutionNode) {

            console.log(node);
            if (!this.graphDataState.firstNodeArrived) {
                this.graphDataState.nodesInGraph.set(node.id, node);
                console.log("first node inserted");
                console.log(node);
                this.addNodeToGraph(node);
                this.graphDataState.firstNodeArrived = true;
            }

            // get all incidend edges
            const unresolvedEdgesTo = this.graphDataState.unresolvedEdgesTo.get(node.id);
            const unresolvedEdgesFrom = this.graphDataState.unresolvedEdgesFrom.get(node.id);
            
            const edgesToAdd = [];

            // in going edges
            unresolvedEdgesTo?.forEach((edgeFromData: ExecutionNodesConnection, edgeId: number) => {
                // if other node is in graph already
                if (this.graphDataState.nodesInGraph.has(edgeFromData.NodeIdFrom)) {
                    edgesToAdd.push(edgeFromData);
                }
            });

            // out going edges
            unresolvedEdgesFrom?.forEach((edgeFromData: ExecutionNodesConnection, edgeId: number) => {   
                // if other node is in the graph already
                if (this.graphDataState.nodesInGraph.has(edgeFromData.NodeIdTo)) {
                    edgesToAdd.push(edgeFromData);
                }
            })
            
          
            // if there are some edges we can add now
            if (edgesToAdd.length != 0) {
                // we add new node into the graph
                //console.log("here");
                this.addNodeToGraph(node);

               // if (!this.graphDataState.nodesInGraph.has(node.id))
               edgesToAdd.forEach((edgeToAdd:ExecutionNodesConnection ) => {
                   // first delete it from unresolved
                   unresolvedEdgesFrom?.delete(edgeToAdd.id)
                   unresolvedEdgesTo?.delete(edgeToAdd.id)

                   this.addEdgeToGraph(edgeToAdd);
               })




            }
            else
            {   // there were no edges waiting for this node => we add this node as unresolved
             //   if (!this.graphDataState.nodesInGraph.has(node.id) && !this.graphDataState.unresolvedNodes.has(node.id))
                    this.graphDataState.unresolvedNodes.set(node.id, node);
            }

        },
        async procecessNewEdge(edge: ExecutionNodesConnection)
        {   

            const nodeIdFrom = edge.NodeIdFrom
            const nodeIdTo = edge.NodeIdTo;

            // both are already in graph => only add edge to the graph
            if (this.graphDataState.nodesInGraph.has(nodeIdTo) && this.graphDataState.nodesInGraph.has(nodeIdFrom)) {
                this.addEdgeToGraph(edge);
            }
            else if (this.graphDataState.nodesInGraph.has(nodeIdTo) && this.graphDataState.unresolvedNodes.has(nodeIdFrom))
            {
                // node from is in unresolved but we have 
                // we can add unresolved node into the graph
                const nodeFrom = this.graphDataState.unresolvedNodes.get(nodeIdFrom);

                // + add it to the graph
                this.addNodeToGraph(nodeFrom);

                this.addEdgeToGraph(edge);

                // when we add new node(nodeFrom) with the new edge
                // we also want to recursively check if there aren't any 
                // incident edges with this new node that are waiting to be added
                // if so => we add them
                this.tryToAddAllIncidentUnresolvedEdges(nodeFrom);

            }
            else if (this.graphDataState.nodesInGraph.has(nodeIdFrom) && this.graphDataState.unresolvedNodes.has(nodeIdTo)) {
                const nodeTo = this.graphDataState.unresolvedNodes.get(nodeIdTo);

                // + add it to the graph
                 this.addNodeToGraph(nodeTo);
                // this.procecessNewNode(nodeTo);

                // finally we can add the edge
                this.addEdgeToGraph(edge);

                // when we add new node(nodeTo) with the new edge
                // we also want to recursively check if there aren't any 
                // incident edges with this new node that are waiting to be added
                // if so => we add them
                this.tryToAddAllIncidentUnresolvedEdges(nodeTo);

            }
            else
            {
                console.log(`adding edge ${edge.id} unresolved`);
                // non of the incidend nodes have arrived yet
                // => we have to put it into the buffer
                
                if (this.graphDataState.unresolvedEdgesFrom.has(nodeIdFrom)) {
                    const edgesFromNode = this.graphDataState.unresolvedEdgesFrom.get(nodeIdFrom);
                    edgesFromNode.set(edge.id, edge);
                }
                else {
                    const newEdgesFromNode = new Map();
                    newEdgesFromNode.set(edge.id, edge);
                    this.graphDataState.unresolvedEdgesFrom.set(nodeIdFrom, newEdgesFromNode);
                }

                
                if (this.graphDataState.unresolvedEdgesTo.has(nodeIdTo)) {
                    const edgesToNode = this.graphDataState.unresolvedEdgesTo.get(nodeIdTo);
                    edgesToNode.set(edge.id, edge);
                }
                else {
                    const newEdgesToNode = new Map();
                    newEdgesToNode.set(edge.id, edge);
                    this.graphDataState.unresolvedEdgesTo.set(nodeIdTo, newEdgesToNode);
                }

            }
        },
        addNodeToGraph(nodeData: ExecutionNode)  {
            
            this.graphDataState.nodesInGraph.set(nodeData.id, nodeData);
            this.graphDataState.unresolvedNodes.delete(nodeData.id);

            // first we try to add domain 
            const parentId = this.categorizeNewNodeToDomain(nodeData)

            //console.log("adding");
            this.renderGraphState.currentRenderDetailGraph.add({
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

            this.graphStatePersistant.currentZoom = this.renderGraphState.currentRenderDetailGraph.zoom();
            this.graphStatePersistant.currentPan = this.renderGraphState.currentRenderDetailGraph.pan();

            const layout = this.renderGraphState.currentRenderDetailGraph.makeLayout(
                this.renderGraphLayout
            );

            layout.run();

            // we also have to update the collapsing api so it works
            // after new insertion
            this.updateCollapsingAPI();

            this.renderGraphState.currentRenderDetailGraph.zoom(this.graphStatePersistant.currentZoom);
            this.renderGraphState.currentRenderDetailGraph.pan(this.graphStatePersistant.currentPan);

            this.updateLastNodeId(nodeData.id);
            
        },
        tryToAddAllIncidentUnresolvedEdges(unresolvedNode: ExecutionNode)
        {
            const unresolvedEdgesTo = this.graphDataState.unresolvedEdgesTo.get(unresolvedNode.id);
            const unresolvedEdgesFrom = this.graphDataState.unresolvedEdgesFrom.get(unresolvedNode.id);

            const edgesToAdd = [];

            // in going edges
            unresolvedEdgesTo?.forEach((edgeToData: ExecutionNodesConnection, edgeId: number) => {
                // if other node is in graph already
                if (this.graphDataState.unresolvedNodes.has(edgeToData.NodeIdFrom)) {
                    edgesToAdd.push(edgeToData);
                }
            });

            // out going edges
            unresolvedEdgesFrom?.forEach((edgeFromData: ExecutionNodesConnection, edgeId: number) => {   
                // if other node is in the graph already
                if (this.graphDataState.unresolvedNodes.has(edgeFromData.NodeIdTo)) {
                    edgesToAdd.push(edgeFromData);
                }
            })

            /*console.log(nodeFrom.id);
            console.log(edgesToAdd);*/

            edgesToAdd.forEach((edgeToAdd: ExecutionNodesConnection ) => {

                unresolvedEdgesFrom?.delete(edgeToAdd.id);
                unresolvedEdgesTo?.delete(edgeToAdd.id);

                this.procecessNewEdge(edgeToAdd);
            })
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
        addEdgeToGraph(edgesData: ExecutionNodesConnection) {
            this.renderGraphState.currentRenderDetailGraph.add({
                
                group: 'edges',
                data: {
                    id: `edge-${edgesData.id.toString()}`,
                    source: edgesData.NodeIdFrom.toString(),
                    target: edgesData.NodeIdTo.toString(),
                }
            })

            this.updateLastEdgeId(edgesData.id);
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
        categorizeNewNodeToDomain(node: ExecutionNode) { 

            const hostname = node.url.hostname;

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
        initiateLinkRenderGraph(graphContainer: HTMLElement) {   
            console.log("here initialising");
            this.renderGraphState.currentRenderDetailGraph = cytoscape({
                container: graphContainer,
                boxSelectionEnabled: false,
                autounselectify: true,
                wheelSensitivity: 0.5,
                minZoom: 0.2,
                maxZoom: 1.7,

                layout: this.renderGraphLayout,
                style: cytoscape
                  .stylesheet()
                  .selector('node')
                  .css(this.renderGraphNodeCss)
                  .selector('edge')
                  .css(this.renderGraphEdgeCss),
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


            // TODO: add support for doube tap properly
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
        updateCollapsingAPI() {
            
            this.renderGraphState.collapsingAPI = this.renderGraphState.currentRenderDetailGraph.expandCollapse({       
                layoutBy: {
                  name: 'cose-bilkent',
                  animate: true,
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