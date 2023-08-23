import EventEmitter from "events";
import { ExecutionNode } from "../database/interface"

class MessageQueueManager
{

    event: EventEmitter = new EventEmitter()

    constructor() {

    }

    OnNewNodeDataRecieve(nodeData: ExecutionNode) {
        this.event.emit('nodeRecieved', nodeData);
    }

    OnNewEdgeDataRecieve(nodeId1: number, nodeId2: number) {
        this.event.emit('edgeRecieved', nodeId1, nodeId2);
    }
}


export default new MessageQueueManager();