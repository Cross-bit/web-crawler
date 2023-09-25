import { error } from "console";
import { ExecutionNodeWithErrors, ExecutionNodeConnections, IDatabaseWrapper } from "../../../../../../database/interface";
import amqpClient, {Channel, Connection } from "amqplib"

enum graphElementType { G_NODE, G_EDGE }


interface IQueueGraphData {
    recordId: number
    executionId: number
    /**
     * this is the number that holds information about the order in which executions were actually executed 
     * (which exe was first, second, ... executionId does not have this property, meaning exe with ID smaller could be executed later etc.)
     */
    executionSequenceNumber: number 
    dataType: graphElementType
    graphData: ExecutionNodeWithErrors | ExecutionNodeConnections
}




class GraphMessagingQPublisher {

    connection: Connection | null
    channel: Channel | null
    qBaseUrl: string
    qPort: number
    qUser: string
    qPass: string
    exchangeName: string

    constructor() {

        this.connection = null;
        this.channel = null;

        this.qBaseUrl = 'amqp://localhost';
        this.qPort = +(process.env.AMQP_PORT || 5672);
        this.qUser = process.env.RABBITMQ_USER || "root";
        this.qPass = process.env.RABBITMQ_PASS || "toor";
        this.exchangeName = process.env.RABBITMQ_GRAPH_DATA_EXCHANGE || "GraphDataExchange";
    }


    public async Connect() {
        try {
            const amqpConenctionURL = `amqp://${this.qUser}:${this.qPass}@rabbitmq:${this.qPort}`;
            this.connection = await amqpClient.connect(amqpConenctionURL);

            this.channel = await this.connection.createChannel();
            console.log("ok");
        }
        catch(err) {
            console.log("faill");
            console.warn(err) // TODO: log proper error
            this.channel?.close();
            this.connection?.close();
        }
    }

    public async Disconnect() {
        this.channel?.close();
        this.connection?.close();
    }

    public publishNodeData(nodeData: ExecutionNodeWithErrors, executionId: number, executionSequenceNumber: number) {
      //  console.log(nodeData);
        const newQueueData: IQueueGraphData = {
            recordId: nodeData.recordId,
            executionId: executionId,
            executionSequenceNumber,
            graphData: nodeData,
            dataType: graphElementType.G_NODE,
        }

        this.publishData(newQueueData);
    }


    public publishEdgeData(edgeData: ExecutionNodeConnections, recordId: number, executionId: number, executionSequenceNumber: number) {
        
        const newQueueData: IQueueGraphData = {
            recordId: recordId,
            executionId: executionId,
            executionSequenceNumber,
            graphData: edgeData,
            dataType: graphElementType.G_EDGE,
        }

        this.publishData(newQueueData);
    }

    private publishData(data: IQueueGraphData) {
        this.channel?.publish(this.exchangeName, '', Buffer.from(JSON.stringify(data)));
    }
}




export default new GraphMessagingQPublisher();