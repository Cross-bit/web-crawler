import ExecutionsPriorityQueue from "./executionsQueue"
import ExecutionsRecord from './executionRecord'
import { IExecutionQueuesManager } from "./interface"
import { RecordData } from "../../database/interface"

export default class ExecutionQueuesManager implements IExecutionQueuesManager
{
    /**
     * Maps record id to its execution queue
     */
    private executionsQueues: Map<number, ExecutionsPriorityQueue>
    
    /**
     * Specifies order in which the elements should be retrieved
     */
    private recordIds: number[] // todo: maybe change this to linked list ... because of the deletation

    private currentExecutionIndex: number; 

    public constructor() {
        this.executionsQueues = new Map<number, ExecutionsPriorityQueue>();
        this.currentExecutionIndex = 0;
        this.recordIds = [];
    }

    public Size = () => this.recordIds.length;

    public async InsertExecutionRecord(executionRec: ExecutionsRecord) {

        const recordId = executionRec.recordID;

        let correspondingQ = this.executionsQueues.get(recordId);
    
        if (!correspondingQ) {
            correspondingQ = new ExecutionsPriorityQueue();
            this.executionsQueues.set(recordId, correspondingQ);
            this.recordIds.push(recordId);
        }

        correspondingQ.Push(executionRec);
    }

    public RemoveQueue(recordId: number): boolean {

        let indexToRemove = -1;
        for (; indexToRemove < this.recordIds.length; indexToRemove++){
            if (this.recordIds[indexToRemove] == recordId)
                break;
        }

        this.recordIds.splice(indexToRemove, 1);

        return this.executionsQueues.delete(recordId) && indexToRemove != -1;
    }

    /**
     * Returns next item in round-robin like fashion across all the queues
     * (it pops the item from the appropriate queue)
     * @returns 
     */
    public TryToGetNextItem(): ExecutionsRecord | undefined {

        for (let i = this.currentExecutionIndex; i < this.recordIds.length; i++){
            
            const recordId = this.recordIds[this.currentExecutionIndex]
            const queue = this.executionsQueues.get(recordId) as ExecutionsPriorityQueue


            if (queue && queue.GetSize() > 0) {
                this.currentExecutionIndex = (i + 1) % this.recordIds.length;
                return queue.Pop();
            }
            
            this.currentExecutionIndex = (this.currentExecutionIndex + 1) % this.recordIds.length
        }
    }

    public *GetNextQueue() : Generator<ExecutionsPriorityQueue> {
        
        while (this.recordIds.length > 0) {
            const recordId = this.recordIds[this.currentExecutionIndex]

            yield this.executionsQueues.get(recordId) as ExecutionsPriorityQueue;
            this.currentExecutionIndex = (this.currentExecutionIndex + 1) % this.recordIds.length;
        }
    }
}