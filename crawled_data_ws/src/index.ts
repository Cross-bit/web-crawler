import { router as v1GraphDataRouter } from "./v1/routes/graphDataRouter";
import express, { Application, Request, Response } from "express";
import amqpClient, {connect, Channel } from "amqplib"
import cors from "cors";

const expressApp: Application = express();

const PORT = +(process.env.APPLICATION_PORT || 5500)

/*const RABBIT_MQ_USER = process.env.RABBITMQ_USER || "root";
const RABBIT_MQ_PASS = process.env.RABBITMQ_PASS || "toor";
const AMQP_PORT = +(process.env.AMQP_PORT || 5672);*/


expressApp.use(cors());
expressApp.use(express.json());

/*
const amqpConenctionURL = `amqp://${RABBIT_MQ_USER}:${RABBIT_MQ_PASS}@rabbitmq:${AMQP_PORT}`

console.log(amqpConenctionURL);

async function getAmqpConnection()
{
  return await amqpClient.connect(amqpConenctionURL);
}*/


expressApp.use("/api/v1/sseGraphData", v1GraphDataRouter);


expressApp.listen(PORT, async () => {

  /*const amqpConnection = await getAmqpConnection();

  const channel = await amqpConnection.createChannel();
  await channel.assertExchange("ma", "topic");
  await channel.bindQueue("crawled_data", "ma", "");
  //channel.checkExchange()

  channel.publish("ma", '', new Buffer("data"));*/


  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});