// express imports
import http from 'http'
import express, { Application, Request, Response } from "express";
import cors from "cors";

import { router as v1GraphDataRouter } from "./v1/routes/graphDataRouter";
import {router as v1NodesDataRouter} from './v1/routes/nodesDataRouter'

// graphql imports
import { graphqlHTTP } from 'express-graphql'
import graphqlServer from './v1/graphql/graphqlServer';

// rabbit mq imports
import MessageQueueManager, { IGraphData, graphElementType } from "./services/MessageQueueManager";

// other services
import GraphDataCache from "./services/GraphDataCaching/GraphDataCache";
import GraphDataSSEConnections from "./services/GraphDataSSEConnections";
import INewGraphDataDTO from "./services/DTOInterface";

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

  const interval = setInterval(async () => {

    const isQueueReady = await messageQueue.CheckIfQueueIsAlive()

    if (isQueueReady) {
      clearInterval(interval)
      await messageQueue.Connect();
      await messageQueue.BeginConsumming();
    }

  }, 2500)
}

initiateMessageQueue();

const expressApp: Application = express();

const PORT = +(process.env.APPLICATION_PORT || 5500)

// add plugins

expressApp.use(cors());
expressApp.use(express.json());


// TODO: delete testing endpoint
expressApp.get("/read/:exeId", async (req, res)=>{
  await messageQueue.BeginConsumming();

  const {
    params: { exeId: exeId },
} = req;

});

// express routers set up

expressApp.use('/api/v1/sseGraphData', v1GraphDataRouter);
expressApp.use('/api/v1/nodes', v1NodesDataRouter);

// graph ql set up
expressApp.use('/graphql', graphqlServer);

expressApp.listen(PORT, async () => {

  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});