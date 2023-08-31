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

    const currentExecutionId = Number(req.query.executionId);
    const lastNodeId = Number(req.query.nodeId);
    const lastEdgeId = Number(req.query.edgeId);
    
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
    
    const graphData = await GetAllNewGraphData(recordId, currentExecutionId, lastNodeId, lastEdgeId);
    

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