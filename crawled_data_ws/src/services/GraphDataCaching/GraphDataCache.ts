import { channel } from "diagnostics_channel";
import { ExecutionNodeConnection, ExecutionNode, ExecutionNodeWithExecution, ExecutionNodeConnectionWithExecution } from "../../database/interface"
import {graphElementType , IGraphData as IGraphData} from "../MessageQueueManager"
import { GetAllNewerConnections, GetNodesByRecordIdsQuery } from "../../database/postgress/graphDataDatabase"
import CacheDataLinkList from "./CacheDataLinkList"
import { EventEmitter } from "stream";
import { GetAllNewerNodes } from "../../database/postgress/graphDataDatabase"

type RecordId = number;
type ExecutionId = number;
type SequenceNumber = number;
type NodeId = number;
type EdgeId = number;

/*export interface NewDataEventArgs
{
    recordId: number
    executionId: number
    type: graphElementType
    newGraphData: ExecutionNode | ExecutionNodeConnection
}*/

class GraphDataCache
{
    /**
     * currently active executions to given record ids
     */
    activeExeId: Map<RecordId, ExecutionId>;

    /**
     * currently active execution sequence number to given record ids
     */
    activeSequenceNumber: Map<RecordId, SequenceNumber>;
    /**
     * list of all nodes by record id
     */
    nodesCache: Map<RecordId, CacheDataLinkList<ExecutionNode>>;
    /**
     * list of all edges by record id
     */
    edgesCache: Map<RecordId, CacheDataLinkList<ExecutionNodeConnection>>;

    event: EventEmitter;

    canAnnounceNewData: boolean;

    constructor() {
        this.activeExeId = new Map<RecordId, ExecutionId>();
        this.activeSequenceNumber = new Map<RecordId, SequenceNumber>();

        this.nodesCache = new Map<RecordId, CacheDataLinkList<ExecutionNode>>();
        this.edgesCache = new Map<RecordId, CacheDataLinkList<ExecutionNodeConnection>>();
        this.event = new EventEmitter();
        this.canAnnounceNewData = true;
    }

    hasData(recordId: number) {
        return this.activeExeId.has(recordId);
    }

    getExeIdByRecId(recordId: number){
        return this.activeExeId.get(recordId);
    }

    getSequenceNumberByRecId(recordId: number){
        return this.activeSequenceNumber.get(recordId);
    }

    public flushCacheData(recordId: number) {
        this.activeExeId.delete(recordId);
        this.activeSequenceNumber.delete(recordId);
        this.flushNodesCacheData(recordId);
        this.flushEdgesCacheData(recordId);
    }

    public flushNodesCacheData(recordId: number) {
        this.nodesCache.delete(recordId);
    }

    public flushEdgesCacheData(recordId: number) {
        this.edgesCache.delete(recordId);
    }

    public writeIncommingDataArr(newData: IGraphData[]) {
        newData.forEach((data) => {
            this.writeIncommingData(data);
        })
    }

    /**
     * Allows client to turn on/off notification of subscribers on newDataRecievedEvent
     * Note, that if set to false it does not cause unsubscription only stops emitting the data.
     * @param value 
     */
    public SetDataAnnouncemet(value: boolean){
        this.canAnnounceNewData = value;
    }

    public writeIncommingData(newData: IGraphData) {

        console.log("writing new incomming data")
        console.log(newData)

        // check if we register record id
        if (this.activeExeId.has(newData.recordId)) { //TODO: change this to sequence number?
            const currentRecordExeId = this.activeExeId.get(newData.recordId) as number;
            const currentExecutionSequenceNumber = this.activeSequenceNumber.get(newData.recordId) as number;

            if (currentExecutionSequenceNumber == newData.executionSequenceNumber /*currentRecordExeId == newData.executionId*/) {               
                this.addDataToRecord(newData); // we are only adding new node/edge to current graph
                return;
            }
            else if(currentExecutionSequenceNumber < newData.executionSequenceNumber)
                this.flushCacheData(newData.recordId); // completly new data => delete all previous
            else
                return;
                // otherwise currentRecordExeId > newData.executionId
                // the data must have wandered somewhere... and only came now, 
                // but we are already registering execution with newer(bigger) execution sequence number => ignore it
        }

        console.log(newData);

        this.initialiseNewDataId(newData); // otherwise we have to initialise maps first
        this.addDataToRecord(newData); // write new data into a cache
    }

    private initialiseNewDataId(newGraphData: IGraphData) {
        
        this.activeExeId.set(newGraphData.recordId, newGraphData.executionId);
        console.log("sequence here");
        console.log(newGraphData.executionSequenceNumber);
        this.activeSequenceNumber.set(newGraphData.recordId, newGraphData.executionSequenceNumber);

        if (newGraphData.dataType == graphElementType.G_NODE) {
            
            this.nodesCache.delete(newGraphData.recordId);
            this.nodesCache.set(newGraphData.recordId, new CacheDataLinkList<ExecutionNode>());
        }
        else
        {
            this.edgesCache.delete(newGraphData.recordId);
            this.edgesCache.set(newGraphData.recordId, new CacheDataLinkList<ExecutionNodeConnection>());
        }
    }

    private addDataToRecord(newData: IGraphData) {
        
        // decide whether newData are edge or node definition
        if(newData.dataType == graphElementType.G_NODE) {

            if (!this.nodesCache.has(newData.recordId))
                this.initialiseNewDataId(newData);

            this.addNewNode(newData.recordId, newData.graphData as ExecutionNode);
        }
        else 
        {
            if (!this.edgesCache.has(newData.recordId))
                this.initialiseNewDataId(newData);

            this.addNewEdge(newData.recordId, newData.graphData as ExecutionNodeConnection);
        }
    }

    private addNewNode(recordId: number, nodeData: ExecutionNode) {
        const cache = this.nodesCache.get(recordId);
        cache?.pushValue(nodeData.id, nodeData);
        this.OnNewDataWritten(recordId, nodeData, graphElementType.G_NODE);
    }

    private addNewEdge(recordId: number, edgeData: ExecutionNodeConnection) {
        const cache = this.edgesCache.get(recordId);
        cache?.pushValue(edgeData.id, edgeData);
        this.OnNewDataWritten(recordId, edgeData, graphElementType.G_EDGE);
    }

    async readAllNodesData(recrodId: number, executionId: number) {
        return await this.readAllNewNodesData(recrodId, executionId, -1);
    }

    async readAllEdgeData(recrodId: number, executionId: number) {
        return await this.readAllNewEdgesData(recrodId, executionId, -1);
    }


    async OnNewDataWritten(recordId: number , newData: ExecutionNodeConnection | ExecutionNode, type: graphElementType)
    {
        if(this.canAnnounceNewData) {
            this.event.emit("newDataWritten", {
                recordId,
                executionSequenceNumber: this.getSequenceNumberByRecId(recordId) as number,
                executionId: this.getExeIdByRecId(recordId) as number,
                dataType: type,
                graphData: newData
            }
            );
        }
    }

    /**
    * Retrieves data for all nodes associated with the given record whose node ID is greater than the specified value.
    * The function initially attempts to retrieve the data from the cache; 
    * in the event of a cache miss, it then queries the database for the data.
    * @param recordId - The ID of the record for which node data is being fetched.
    * @param lastNodeId - The function retrieves nodes with IDs greater than this value. If set to -1, all nodes are returned.
    * @returns An array containing nodes with node IDs greater than lastNodeId, or all nodes if lastNodeId is set to -1.
    */
    async readAllNewNodesData(recordId: number, sequenceNumber: number, lastNodeId?: number) : Promise<ExecutionNode[]>
    {
        const currentSequenceNumber = this.activeSequenceNumber.get(recordId); // if undefined we dont have the record at all

        console.log("tunaj");
        console.log(currentSequenceNumber);
        console.log(currentSequenceNumber == sequenceNumber);

        if (currentSequenceNumber && currentSequenceNumber > -1 && currentSequenceNumber == sequenceNumber
            && this.nodesCache.has(recordId)) {

            console.log("reading node data from cache");
            // we have current exe id and it is actuall
            console.log(this.nodesCache.get(recordId));
            const cache = this.nodesCache.get(recordId) as CacheDataLinkList<ExecutionNode>;
            return lastNodeId ? cache.readAllGreaterThan(lastNodeId) : cache.readAll();
        }
        else {
            console.log("reading node data from database");
            // otherwise data are deprecated or cache miss => sync with db
            // this will not happen very often


            const newerNodesData = await (lastNodeId ? GetAllNewerNodes(recordId, lastNodeId) : GetAllNewerNodes(recordId));

            /*if (newerNodesData.length == 0)
                return null;*/

            if (!lastNodeId) 
                this.flushNodesCacheData(recordId);

            const { graphDataList, nodeDataList } = newerNodesData.reduce(
                (acc: { graphDataList: IGraphData[], nodeDataList: ExecutionNode[] }, nodeDataWithExe: ExecutionNodeWithExecution) => {
                  const { lastExecution, ...nodeData } = nodeDataWithExe;
              
                  acc.graphDataList.push({
                    recordId: lastExecution.recordId,
                    executionId: lastExecution.id as number,
                    dataType: graphElementType.G_NODE, //'G_NODE'
                    executionSequenceNumber: lastExecution.sequenceNumber, // Consider checking for null
                    graphData: nodeData,
                  });

                  //as IGraphData
                  acc.nodeDataList.push(nodeData);
              
                  return acc;
                },
                { graphDataList: [], nodeDataList: [] }
              );

            this.writeIncommingDataArr(graphDataList);

            return nodeDataList;
        }
    }

    /**
     * Retrieves data for all edges associated with the given record, where the edge ID is greater than the specified value.
     * The function first attempts to retrieve the data from the cache;
     * if the cache does not contain the data, it then queries the database.
     * @param recordId - The ID of the record for which edge data is being fetched.
     * @param lastEdgeId - The function retrieves edges with IDs greater than this value. If set to -1, all edges are returned.
     * @returns An array containing edges with edge IDs greater than lastEdgeId, or all edges if lastEdgeId is set to -1. 
     * If there are no data(not even in the database) returns null.
     */
    async readAllNewEdgesData(recordId: number, sequenceNumber: number, lastEdgeId?: number) : Promise<ExecutionNodeConnection[]>
    {

        const currentSequenceNumber = this.activeExeId.get(recordId);

        console.log(currentSequenceNumber);
        console.log(sequenceNumber);
        console.log(this.edgesCache.has(recordId));
        if (currentSequenceNumber && currentSequenceNumber > -1 && currentSequenceNumber == sequenceNumber
            && this.edgesCache.has(recordId)
            ) {
            // we have current exe id and it is actuall
            console.log("reading edges data from cache");
            const cache = this.edgesCache.get(recordId) as CacheDataLinkList<ExecutionNodeConnection>;
            return lastEdgeId ? cache?.readAllGreaterThan(lastEdgeId) : cache?.readAll();
        }
        else
        {
            // otherwise data are deprecated or cache miss => sync with db
            // this will not happen very often
            const newerEdgesData = await (lastEdgeId ? GetAllNewerConnections(recordId, lastEdgeId) : GetAllNewerConnections(recordId));
            //NOTE: we dont need to check if requested data have the correct executionId, since there are
            // always only one data to a record

            /*if (newerEdgesData.length == 0)
                return null;*/


            if (!lastEdgeId) 
                this.flushEdgesCacheData(recordId);

            // we need to build two lists ... since cache write has bit different interface from the pure edge data list that we return
            const { graphDataList, edgeDataList } = newerEdgesData.reduce(
                (acc: { graphDataList: IGraphData[], edgeDataList: ExecutionNodeConnection[] }, edgeDataWithExe: ExecutionNodeConnectionWithExecution) => {
                  const { lastExecution, ...edgeData } = edgeDataWithExe;
              
                  acc.graphDataList.push({
                    recordId: lastExecution.recordId,
                    executionId: lastExecution.id as number,
                    dataType: graphElementType.G_EDGE, //'G_NODE'
                    executionSequenceNumber: lastExecution.sequenceNumber, // Consider checking for null
                    graphData: edgeData,
                  });

                  acc.edgeDataList.push(edgeData);
              
                  return acc;
                },
                { graphDataList: [], edgeDataList: [] }
              );

            this.writeIncommingDataArr(graphDataList);

            
            return edgeDataList;
        }
    }
}


export default new GraphDataCache();