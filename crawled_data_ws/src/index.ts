import { router as v1GraphDataRouter } from "./v1/routes/graphDataRouter";
import {router as v1NodesDataRouter} from './v1/routes/nodesDataRouter'

import express, { Application, Request, Response } from "express";
import amqpClient, {connect, Channel } from "amqplib"
import cors from "cors";
import MessageQueueManager, { IGraphData, graphElementType } from "./services/MessageQueueManager";
import { ExecutionNode, ExecutionNodeConnection } from "./database/interface"

import GraphDataCache from "./services/GraphDataCaching/GraphDataCache";
import GraphDataSSEConnections from "./services/GraphDataSSEConnections";
import INewGraphDataDTO from "./services/DTOInterface";

/*const list = new CachedDataLinkedList();
console.log(list.readAllGreaterThan(2));*/

const messageQueue = MessageQueueManager;

const initiateMessageQueue = async () => {

  // if we recive new crawled data, write them into the cache
  messageQueue.eventEmitter.on("newDataRecieved", (graphData) => GraphDataCache.writeIncommingData(graphData));
  //messageQueue.eventEmitter.on("newDataRecieved", (graphData) => GraphDataSSEConnections.sendDataToClients(graphData));

  // if we write any data into the cache we want to inform clients about these new data
  GraphDataCache.event.on("newDataWritten", (newData: IGraphData) => {
    const { recordId, executionId, graphData, dataType } = newData;

    const dtoData = { 
        recordId,
        currentExecutionId: executionId,
        isFullyNew: false,
        nodesData: dataType == graphElementType.G_NODE ? [graphData] : [],
        edgesData: dataType == graphElementType.G_EDGE ? [graphData] : [],
        
    } as INewGraphDataDTO

      GraphDataSSEConnections.sendDataToClients(dtoData)
  })

  await messageQueue.Connect();
  await messageQueue.BeginConsumming();
}

initiateMessageQueue();

const expressApp: Application = express();

const PORT = +(process.env.APPLICATION_PORT || 5500)


expressApp.use(cors());
expressApp.use(express.json());

expressApp.get("/read/:exeId", async (req, res)=>{
  await messageQueue.BeginConsumming();

  const {
    params: { exeId: exeId },
} = req;

});


expressApp.use("/api/v1/sseGraphData", v1GraphDataRouter);
//expressApp.use("/api/v1/graphData", v1NodesDataRouter);

expressApp.use("/api/v1/nodes", v1NodesDataRouter);

expressApp.listen(PORT, async () => {

  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});