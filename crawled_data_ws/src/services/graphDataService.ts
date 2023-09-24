import { NextFunction, Request, Response } from "express";
import { ExecutionNode, ExecutionNodeConnection } from "../database/interface"
import { GetAllRecordsByNodeUrl } from '../database/postgress/recordsDatabase'
import GraphDataCache from "../services/GraphDataCaching/GraphDataCache"
import INewGraphDataDTO from "./DTOInterface"
import MessageQueueManager from "./MessageQueueManager";


export async function GetAllNewGraphData(recordId: number, executionId: number, lastNodeId?: number, lastEdgeId?: number): Promise<INewGraphDataDTO>
{

    // stop consuming so the node and edge data can be read atomically
    await MessageQueueManager.StopConsumming();
    GraphDataCache.SetDataAnnouncemet(false);

    let newNodesData = [];
    let newEdgesData = [];

    
    //TODO: error handling
    newNodesData = await GraphDataCache.readAllNewNodesData(recordId, executionId, lastNodeId) as ExecutionNode[];
    newEdgesData = await GraphDataCache.readAllNewEdgesData(recordId, executionId, lastEdgeId) as ExecutionNodeConnection[];

    
    const currentExecutionId = GraphDataCache.getExeIdToRecId(recordId);
    
    console.log("new current execution id");
    console.log(currentExecutionId);
    
    // restore queue consumption
    GraphDataCache.SetDataAnnouncemet(true);
    await MessageQueueManager.BeginConsumming();

    return { 
        recordId: recordId,
        currentExecutionId: currentExecutionId,
        isFullyNew: (currentExecutionId != executionId),
        nodesData: newNodesData,
        edgesData: newEdgesData
        
    } as INewGraphDataDTO
}

export async function GetAllRecordsCrawledSameUrl(nodeUrl: string) 
{
    return GetAllRecordsByNodeUrl(nodeUrl);
}


