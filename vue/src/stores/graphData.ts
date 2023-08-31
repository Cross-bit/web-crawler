import { defineStore } from "pinia";
import { api } from "../boot/axios"
import * as message from "../common/qusarNotify"
import * as cydagre from 'cytoscape-dagre';
import * as cytoscape from "cytoscape";
import nodeHtmlLabel from 'cytoscape-node-html-label';
import coseBilkent from 'cytoscape-cose-bilkent';
import expandCollapse from 'cytoscape-expand-collapse';
import { nodesApi } from "../boot/axios"
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
    currentEventSource: EventSource;

    constructor() {
        this.lastNodeId = -1;
        this.lastEdgeId = -1;
        this.lastRecievedGraphData = null;
        this.currentEventSource = null;
    }
}

class RenderGraphState
{
    currentRenderDetailGraph: cytoscape.Core;
    graphContainer: HTMLElement;
    currentZoom: number;
    currentPan: cytoscape.Position;
    collapsingAPI: any;

    constructor() {
        this.currentRenderDetailGraph = null;
        this.graphContainer = null;
        this.currentZoom = null;
        this.currentPan = null;
        this.collapsingAPI = null;
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

export interface IGraphState {
    isLiveMode: boolean,
    isDomainView: boolean,
    isNodeDetailOpen: boolean,

    currentExecutionId: number,
    currentGraphRecordId: number,

    graphDataState: GraphDataState,
    renderGraphState: RenderGraphState,
    //graphEventEmitter: EventEmitter,
    lastTappedNode: ExecutionNode,
    lastTappedNodeRecords: RecordData[],
    
    currentProcessingState: CurrentProcessingState,
}

export const useGraphsDataStore = defineStore('graphData', {
    state: (): IGraphState => ({
        isLiveMode: false,
        graphDataState: new GraphDataState(),
        renderGraphState: new RenderGraphState(),
        currentProcessingState: new CurrentProcessingState(),
        lastTappedNode: null,
        lastTappedNodeRecords: [],
        currentGraphRecordId: -1,
        currentExecutionId: -1,
        isNodeDetailOpen: false,
        isDomainView: false,
        //graphEventEmitter: new EventEmitter(),
    }),
    getters: {
        getAllNodes() {
            return;
        },
        nodeData() {
            return;
        },
        renderGraphLayout()
        {

            return {
                name: 'cose-bilkent',
                animate: false,
                nodeDimensionsIncludeLabels: true,
            };
        },
        renderGraphNodeCss() {
            return {
                shape: "roundrectangle",
                height: 50,
                width: (node) => node.data('name').length*10,
                'background-color': (node) =>
                  node.data("active") ? "green" : "white",
                color: (node) => (node.data("active") ? "white" : "black"),
                "border-color": "gray",
                "border-width": 3,
                "border-radius": 4,
                content: "data(name)",
                "text-wrap": "wrap",
                "text-valign": "center",
                "text-halign": "center",
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
    },
    actions: {
        async connectToGraphDataSSE(recordId: number) {

            const procState = this.currentProcessingState;

            const lastNodeId = procState.lastNodeId;
            const lastEdgeId = procState.lastEdgeId;
            console.log(lastNodeId);
            console.log(lastEdgeId);

            const servicePort = (process.env.GRAPH_READ_SERVICE_PORT || 5500)
            let reqUrl = `http://localhost:${servicePort}/api/v1/sseGraphData/${recordId}?`
            reqUrl += `executionId=${this.currentExecutionId}`
            reqUrl += lastNodeId > -1 ? `&nodeId=${lastNodeId}` : '';
            reqUrl += lastEdgeId > -1 ? `&edgeId=${lastEdgeId}` : '';

            //console.log(reqUrl);

            procState.currentEventSource = new EventSource(reqUrl);
            procState.currentEventSource.onopen = () => console.log('Connection opened');
            procState.currentEventSource.onerror = (error) => console.log(error);
            procState.currentEventSource.onmessage = (event) => this.onNewGraphDataUpdate(event.data);

            setTimeout(() => {
                if (!this.isLiveMode)
                    this.disconnectFromGraphDataSSE()
                }, 2000);
        },
        flushAllCurrentData(){
            return;
        },
        async disconnectFromGraphDataSSE() {
            console.log("Graph data connection Closed");
            this.currentEventSource?.close();
        },

        async onNewGraphDataUpdate(data)  {
            
        const procState = this.currentProcessingState;
        procState.lastRecievedGraphData = JSON.parse(data) as INewGraphDataDTO;
        this.currentExecutionId = procState.lastRecievedGraphData.currentExecutionId;

        let cc = 0;
        let bb = 0;
        
        const domainNames = [
            "domain1",
            /*"domain2",
            "domain3"*/
        ]

        procState.lastRecievedGraphData.nodesData.forEach(nodeData => {
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
                }, bb * 100 + (Math.random() < 0.5 ? -70 : 30))
                bb++;
            });

            procState.lastRecievedGraphData.edgesData.forEach(edgeData => {
                
                setTimeout(() => {
                    this.procecessNewEdge(edgeData);
                }, cc * 100 + (Math.random() < 0.5 ? -20 : 50))
                cc++;
            });

        },

        async procecessNewNode(node: ExecutionNode) {

            if (!this.graphDataState.firstNodeArrived) {
                this.graphDataState.nodesInGraph.set(node.id, node);
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
                if (this.graphDataState.nodesInGraph.has(edgeFromData.NodeIdTo)) {
                    edgesToAdd.push(edgeFromData);
                }
            });

            // out going edges
            unresolvedEdgesFrom?.forEach((edgeFromData: ExecutionNodesConnection, edgeId: number) => {   
                // if other node is in the graph already
                if (this.graphDataState.nodesInGraph.has(edgeFromData.NodeIdFrom)) {
                    edgesToAdd.push(edgeFromData);
                }
            })
    
            // if there are some edges we can add now
            if (edgesToAdd.length != 0) {
                // we add new node into the graph
                this.addNodeToGraph(node);

                edgesToAdd.forEach((edgeToAdd:ExecutionNodesConnection ) => {
                    // first delete it from unresolved
                    unresolvedEdgesFrom?.delete(edgeToAdd.id)
                    unresolvedEdgesTo?.delete(edgeToAdd.id)

                    this.addEdgeToGraph(edgeToAdd);
                })

            }
            else
            {   // there were no edges waiting for this node => we add this node as unresolved
                this.graphDataState.unresolvedNodes.set(node.id, node);
            }

        },
        async procecessNewEdge(edge: ExecutionNodesConnection)
        {   
            const nodeIdFrom = edge.NodeIdFrom
            const nodeIdTo = edge.NodeIdTo;

            // both are already in graph => only add edge to graph
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
                
                // remove node from unresolved
                this.graphDataState.unresolvedNodes.delete(nodeIdFrom);

                this.addEdgeToGraph(edge);
            }
            else if (this.graphDataState.nodesInGraph.has(nodeIdFrom) && this.graphDataState.unresolvedNodes.has(nodeIdTo)) {
                const nodeTo = this.graphDataState.unresolvedNodes.get(nodeIdTo);

                // + add it to the graph
                this.addNodeToGraph(nodeTo);

                // remove node from unresolved
                this.graphDataState.unresolvedNodes.delete(nodeIdTo);

                // finally we can add the edge
                this.addEdgeToGraph(edge);
            }
            else
            {
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

                
                if (this.graphDataState.unresolvedEdgesFrom.has(nodeIdTo)) {
                    const edgesToNode = this.graphDataState.unresolvedEdgesFrom.get(nodeIdTo);
                    edgesToNode.set(edge.id, edge);
                }
                else {
                    const newEdgesToNode = new Map();
                    newEdgesToNode.set(edge.id, edge);
                    this.graphDataState.unresolvedEdgesFrom.set(nodeIdTo, newEdgesToNode);
                }

            }
        },
        addNodeToGraph(nodeData: ExecutionNode)  {
            
            this.graphDataState.nodesInGraph.set(nodeData.id, nodeData);

            // first we try to add domain 
            const parentId = this.categorizeNewNodeToDomain(nodeData)

            //console.log("adding");
            this.renderGraphState.currentRenderDetailGraph.add({
                group: 'nodes',
                data: {
                    id: nodeData.id.toString(),
                    name: nodeData.url.toString(),
                    parent: parentId
                }
            })

            this.renderGraphState.currentZoom = this.renderGraphState.currentRenderDetailGraph.zoom();
            this.renderGraphState.currentPan = this.renderGraphState.currentRenderDetailGraph.pan();

            const layout = this.renderGraphState.currentRenderDetailGraph.makeLayout(
                this.renderGraphLayout
            );

            layout.run();

            // we also have to update the collapsing api so it works
            // after new insertion
            this.updateCollapsingAPI();

            this.renderGraphState.currentRenderDetailGraph.zoom(this.renderGraphState.currentZoom);
            this.renderGraphState.currentRenderDetailGraph.pan(this.renderGraphState.currentPan);

            this.updateLastNodeId(nodeData.id);
            
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
            
            try {
                const endpointUrl = '/nodes/' + encodeURIComponent(this.lastTappedNode.url.toString()) + '/records';

                const response = await nodesApi.get(endpointUrl)
                this.lastTappedNodeRecords = response.data;
                console.log(this.lastTappedNodeRecords );
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
                        name: hostname
                    }
                })

                this.graphDataState.domainGraphNodes.add(hostname);
            }

            return hostname;
            
        },
        initiateLinkRenderGraph(graphContainer: HTMLElement) {   
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

            // TODO: add execution btn properly
            this.renderGraphState.currentRenderDetailGraph.nodeHtmlLabel([
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
            }]);


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


            this.updateRenderedGraph();
        },
        updateCollapsingAPI() {
            this.renderGraphState.collapsingAPI = this.renderGraphState.currentRenderDetailGraph.expandCollapse({       
                layoutBy: {
                  name: 'cose-bilkent',
                  animate: false,
                  randomize: false,
                  fit: true
                },
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