import { NextFunction, Request, Response } from "express";
import GraphDataSSEConnections from "../services/GraphDataSSEConnections";
import GraphDataCache from "../services/GraphDataCaching/GraphDataCache"
import { GetAllNewGraphData, GetAllRecordsCrawledSameUrl as GetAllRecordsThatCrawledSameUrl } from "../services/graphDataService"



export async function sendGraphDataSSE(req: Request, res: Response) {

    const {
        params: { recordId: recordIdRaw },
    } = req;

    const recordId = Number(recordIdRaw)

    // TODO: add validation...
    const clientsSequenceNumber = Number(req.query.sequenceNumber);
    const clientsExecutionId = Number(req.query.executionId);
    const clientsLastNodeId = Number(req.query.nodeId);
    const clientsLastEdgeId = Number(req.query.edgeId);
    
    const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Content-Encoding': 'none',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    }

    res.writeHead(200, headers);

    // we add newly connected client
    GraphDataSSEConnections.addClient(res);

    // on new SSE connection we read new data //we went to live mode/we client is requesting all new data
    
    const graphData = await GetAllNewGraphData(recordId, clientsExecutionId, clientsSequenceNumber, clientsLastNodeId, clientsLastEdgeId);
    

    GraphDataSSEConnections.sendDataToClients(graphData);
}

export async function getAllRecordsToNode(req: Request, res: Response)
{
  const {
      params: { nodeUrl },
  } = req;

  const result = await GetAllRecordsThatCrawledSameUrl(nodeUrl);
  res.status(200).send(result);
}
