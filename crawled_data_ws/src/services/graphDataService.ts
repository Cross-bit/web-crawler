import { NextFunction, Request, Response } from "express";
import { ExecutionNode, ExecutionNodeConnection } from "../database/interface"
import { GetAllRecordsByNodeUrl } from '../database/postgress/recordsDatabase'
import GraphDataCache from "../services/GraphDataCaching/GraphDataCache"
import INewGraphDataDTO from "./DTOInterface"
import MessageQueueManager from "./MessageQueueManager";


export async function GetAllNewGraphData(recordId: number, executionId: number, sequenceNumber: number, lastNodeId?: number, lastEdgeId?: number): Promise<INewGraphDataDTO>
{

    // stop consuming so the node and edge data can be read atomically
    await MessageQueueManager.StopConsumming();
    GraphDataCache.SetDataAnnouncemet(false);

    let newNodesData = [];
    let newEdgesData = [];

    
    //TODO: error handling
    newNodesData = await GraphDataCache.readAllNewNodesData(recordId, sequenceNumber, lastNodeId) as ExecutionNode[];
    newEdgesData = await GraphDataCache.readAllNewEdgesData(recordId, sequenceNumber, lastEdgeId) as ExecutionNodeConnection[];

    
    const currentExecutionId = GraphDataCache.getExeIdByRecId(recordId);
    const currentSequenceNumber = GraphDataCache.getSequenceNumberByRecId(recordId);

    console.log("new current execution id");
    console.log(currentExecutionId);
    
    // restore queue consumption
    GraphDataCache.SetDataAnnouncemet(true);
    await MessageQueueManager.BeginConsumming();

    return { 
        recordId: recordId,
        currentExecutionId: currentExecutionId,
        currentSequenceNumber: currentSequenceNumber,
        isFullyNew: (currentExecutionId != executionId),
        nodesData: newNodesData,
        edgesData: newEdgesData
        
    } as INewGraphDataDTO
}

export async function GetAllRecordsCrawledSameUrl(nodeUrl: string) 
{
    return GetAllRecordsByNodeUrl(nodeUrl);
}


