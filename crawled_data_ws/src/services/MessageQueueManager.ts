import EventEmitter from "stream";
import { ExecutionNode, ExecutionNodeConnection } from "../database/interface";
import amqpClient, {Channel, Connection } from "amqplib"
import http from "http";
export enum graphElementType { G_NODE, G_EDGE }
import axios from 'axios'


export interface IGraphData { // TODO: move somewhere else
    recordId: number
    executionId: number
    dataType: graphElementType
    executionSequenceNumber: number
    graphData: ExecutionNode | ExecutionNodeConnection
}


class MessageQueueManager
{

    eventEmitter: EventEmitter

    connection: Connection | null
    channel: Channel | null
    qBaseUrl: string
    qPort: number
    qUser: string
    qPass: string
    queueName: string
    currentConsumerTag: string | undefined
    isConsuming: boolean = false

    constructor() {

        this.connection = null;
        this.channel = null;

        this.qBaseUrl = 'amqp://localhost';
        this.qPort = +(process.env.AMQP_PORT || 5672);
        this.qUser = process.env.RABBITMQ_USER || "root";
        this.qPass = process.env.RABBITMQ_PASS || "toor";
        this.queueName = process.env.RABBITMQ_GRAPH_DATA_Q1 || "GraphDataQ1";
        this.eventEmitter = new EventEmitter()
    }

    async Connect() {
        try {
            const amqpConenctionURL = `amqp://${this.qUser}:${this.qPass}@rabbitmq:${this.qPort}`;
            console.log(amqpConenctionURL);
            this.connection = await amqpClient.connect(amqpConenctionURL);
            this.channel = await this.connection.createChannel();

        }
        catch(err) {
            console.warn(err) // TODO: log proper error
            await this.Disconnect();
        }
    }

    public async CheckIfQueueIsAlive() {

        const url = 'http://root:toor@rabbitmq:15672/api/aliveness-test/%2F';

        try {
            const result = await axios.get(url);
            
            const { data } =  result;
            
            console.log(data);
            return (data.status === 'ok');
        }
        catch (error) {
            return false;
        }
    }

    public async BeginConsumming() {
        console.log("Msg queue recieving started");
        this.isConsuming = true;

        this.currentConsumerTag = (await this.channel?.consume(
            this.queueName,
            (message) => {
                try {
                    if (message) {
                        //console.log( JSON.parse(message.content.toString()));
                        const recievedData: IGraphData = JSON.parse(message.content.toString()) as IGraphData;
                        //console.log(recievedData);
                        this.OnNewDataRecived(recievedData);
                    }
                }
                catch(error)
                {
                    console.log(error);
                    console.warn("Data recieved from queue are invalid");
                }
            },
            { noAck: true }
        ))?.consumerTag;
    
    }

    public async StopConsumming() {
        if (this.currentConsumerTag)
            await this.channel?.cancel(this.currentConsumerTag);

        console.log("Msg queue recieving stopped");
    }


    async Disconnect() {
        await this.channel?.close();
        await this.connection?.close();
    }

    private OnNewDataRecived(recievedData: IGraphData) {
        //console.log(this.eventEmitter);
        this.eventEmitter.emit('newDataRecieved', recievedData);
    }

    OnNewNodeDataRecieved(nodeData: IGraphData) {
        this.eventEmitter.emit('nodeRecieved', nodeData);
    }

    OnNewEdgeDataRecieved(nodeId1: number, nodeId2: number) {
        this.eventEmitter.emit('edgeRecieved', nodeId1, nodeId2);
    }
}


export default new MessageQueueManager();