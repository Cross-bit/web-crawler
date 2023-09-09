import CrawledDataChunk, {LinkData} from "../interface"
import { ExecutionDataWithRecord, NodeCrawlErrors } from "../../../../../../database/interface";
import { ExecutionNodeWithErrors, ExecutionNodeConnections, IDatabaseWrapper } from "../../../../../../database/interface";
import EventEmitter from "node:events";
// publishes crawled 



export default class DatabaseCrawledDataPublisher
{

    // maps node as string(url) to their real id in database
    // so it represents all nodes that are really in the database
    visitedNodes: Map<string, number>

    // maps nodes that are not yet in the database, 
    // to nodes from which there is oriented edge (we couldnt create edge before, because we didnt have this node in our database)
    unvisitedNodes: Map<string, string[]>

    executionRecord: ExecutionDataWithRecord

    database: IDatabaseWrapper

    TotalCrawlTime: number

    public eventEmitter: EventEmitter = new EventEmitter();

    constructor(database: IDatabaseWrapper, executionRecord: ExecutionDataWithRecord) {
        this.visitedNodes = new Map();
        this.unvisitedNodes = new Map();
        this.executionRecord = executionRecord;
        this.database = database;
        this.TotalCrawlTime = 0;
    }

    /**
     * We always update data as single datachunk
     * @param dataChunk 
     */
    public async PublishDataChunk(dataChunk: CrawledDataChunk) {

        const newEdgesList: ExecutionNodeConnections[] = [];
        const nodeId = await this.PublishNode(dataChunk);

        this.UpdateUnpublishedEdges(dataChunk, nodeId, newEdgesList);
        
        await this.PublishVisitedEdges(dataChunk, nodeId, newEdgesList);
    }

    private GetCorrectErrorValue(errorNumber: number) : string
    {
        switch (errorNumber) {
            case 0:
              return NodeCrawlErrors.OK;
            case 1:
              return NodeCrawlErrors.REGEX;
            case 2:
              return NodeCrawlErrors.EXTENSION;
            case 3:
              return NodeCrawlErrors.INVALID_URI;
            default:
              throw Error(`Unknown error code recieved! Code: ${ errorNumber }`)
          }
    }

    private async PublishNode(dataChunk: CrawledDataChunk) {

        this.TotalCrawlTime += dataChunk.crawlTime;

        const nodeData: ExecutionNodeWithErrors = {
            title: dataChunk.title,
            url: dataChunk.baseUrl,
            crawlTime: dataChunk.crawlTime,
            recordId: this.executionRecord?.record?.id, // TODO: try catch if undefined
            errors: dataChunk.errors.map((errorCode) => this.GetCorrectErrorValue(errorCode))
        };

        const nodeId = await this.database.NodesDatabase?.InsertNewNode(nodeData) as number;
        nodeData.id = nodeId;

        if (!this.visitedNodes.has(dataChunk.baseUrl)) // we always have to add the baseUrl as new
            this.visitedNodes.set(dataChunk.baseUrl, nodeId);

        this.OnNewNodeSentToDatabase(nodeData);

        return nodeId
    }

    /**
     * Updates current edges list, with edges that couldnt be published before, because to/from node hasn't been processed yet.
     * @param dataChunk 
     * @param nodeId 
     */
    private UpdateUnpublishedEdges(dataChunk: CrawledDataChunk, nodeId:number, newEdgesList: ExecutionNodeConnections[])
    {
        // if current new node(with given nodeId) was before tracked as unvisited => we finally have it =>
        // we add all missing edges and delete it from unvisited list

        if (this.unvisitedNodes.has(dataChunk.baseUrl)) {
            // if was before unvisited => we add all missing edges and delete it
            const allNeighbourUrls = this.unvisitedNodes.get(dataChunk.baseUrl) as string[];
          
            allNeighbourUrls.forEach(neighbourUrl => {

                const neighbourNodeId = this.visitedNodes.get(neighbourUrl) as number;
                
                newEdgesList.push({NodeIdFrom: neighbourNodeId, NodeIdTo: nodeId, recordId: this.executionRecord.record.id});
            });

            this.unvisitedNodes.delete(dataChunk.baseUrl);
        }
    }

    /**
     * Publishes all edges that could have been created so far(since we have from/to nodes in db).
     * @param dataChunk 
     * @param nodeId 
     */
    private async PublishVisitedEdges(dataChunk: CrawledDataChunk, nodeId: number, newEdgesList:ExecutionNodeConnections[]) {

        // we go through all outgoing links of the new node by nodeId
        dataChunk.links.forEach(( linkData: LinkData ) => {
            const neighbourNode = linkData.url;

            // if we already visited
            if (this.visitedNodes.has(neighbourNode)) {
                const neighbourNodeId = this.visitedNodes.get(neighbourNode) as number;

                newEdgesList.push({NodeIdFrom: nodeId, NodeIdTo: neighbourNodeId, recordId: this.executionRecord.record.id});
            }
            // else we did not => we note it

            if (this.unvisitedNodes.has(neighbourNode)) {
                const unviditedNodes = this.unvisitedNodes.get(neighbourNode) as string[];
                unviditedNodes.push(dataChunk.baseUrl);
            }
            else {
                this.unvisitedNodes.set(neighbourNode, [dataChunk.baseUrl]);
            }

        })

        for (const edgeData of newEdgesList) {
          
            const connectionId = await this.database.NodesDatabase?.InsertNewNodesRelation(edgeData.NodeIdFrom, edgeData.NodeIdTo, this.executionRecord.record.id);
            edgeData.id = connectionId; // fill in missing new edge id
            this.OnNewEdgeSentToDatabase(edgeData);
        }
          
    }

    private async OnNewEdgeSentToDatabase(edgeData: ExecutionNodeConnections) {

        //console.log("edgeData");
        this.eventEmitter.emit("onEdgePublished", edgeData, this.executionRecord);
    }

    private async OnNewNodeSentToDatabase(nodeData: ExecutionNodeWithErrors) {
        //await sleep(1000);
        this.eventEmitter.emit("onNodePublished", nodeData, this.executionRecord);
    }
 
}
