import { GetAllPlannedExecutions } from '../../database/hasuraAPI/executionsDatabase'
import { ExecutionData, RecordDataPartial } from '../../database/interface'

import cron, { ScheduledTask } from 'node-cron';

import ExecutionsRecord from './executionRecord'

export class QueueNode {
    Data: ExecutionsRecord | undefined;
    Next: QueueNode | undefined;

    constructor() {
        this.Data = undefined;
        this.Next = undefined;
    }
}

/**
 *  Execution queue, that gives order in which executions will be executed for the given record.
 *  Higest priority has execution without periodicall updates.
 */
export default class ExecutionsPriorityQueue
{
    // two separate linked lists

    // this works as priority queue based on the next time of execution
    private headUnTimed: QueueNode | undefined;
    private tailUnTimed: QueueNode | undefined;

     // this works as regular queue
    private headTimed: QueueNode | undefined;
    private tailTimed: QueueNode | undefined;

    private sizeTimedQ: number;
    private sizeUnTimedQ: number;

    constructor() {
        this.sizeTimedQ = 0;
        this.sizeUnTimedQ = 0;
    }

    GetSize = () => this.sizeTimedQ + this.sizeUnTimedQ;

    Push (executionRecord: ExecutionsRecord) {
        const newNode = new QueueNode();
        newNode.Data = executionRecord;

        if (executionRecord.IsTimed) {
            this.PushToTimedQueue(newNode);
        }
        else {
            this.PushToUnTimedQueue(newNode);
        }
    }

    Pop (): ExecutionsRecord | undefined {

        let headData = undefined;

        if (this.sizeUnTimedQ > 0) {
        
            headData = this.PopUnTimedQItem();
        }
        else if (this.sizeTimedQ > 0) {
            
            headData = this.PopTimedQItem();
        } 

        return headData;
    }

    Print(): void {
        let current = this.headUnTimed;
        while (current) {
            console.log(current.Data);
            current = current.Next;
        }
        
        current = this.headTimed;
        while (current) {
            console.log(current.Data);
            current = current.Next;
        }

    }

    private PopUnTimedQItem() : ExecutionsRecord | undefined {
        const headData = this.headUnTimed?.Data;
        this.headUnTimed = this.headUnTimed?.Next;

        if (this.sizeUnTimedQ == 1)
            this.tailUnTimed = undefined;
            
        this.sizeUnTimedQ--;
        return headData;
    }

    private PopTimedQItem() : ExecutionsRecord | undefined {
        const headData = this.headTimed?.Data;
        this.headTimed = this.headTimed?.Next;

        if (this.sizeTimedQ == 1)
            this.tailTimed = undefined;
            
        this.sizeTimedQ--;
        return headData;
    }

    private PushToTimedQueue(newNode: QueueNode) {

        if (!this.headTimed) { // no element yet
            this.headTimed = newNode;
            this.tailTimed = newNode;
            this.headTimed.Next = undefined
            this.sizeTimedQ++;
            return;
        }

        let previous = undefined;
        let currentNode = this.headTimed; // if we have some untimed executions => skip them

        while (currentNode != undefined && this.IsNewRecOlderThan(newNode.Data as ExecutionsRecord, currentNode)) {
            previous = currentNode;
            currentNode = currentNode.Next as QueueNode;
        }
        
        if (previous == undefined) {
            this.headTimed = newNode
            newNode.Next = currentNode
        }
        else {
            previous.Next = newNode
            newNode.Next = currentNode
        }

        if (currentNode == this.tailTimed)
            this.tailTimed = newNode;

        this.sizeTimedQ++;
    }


    private PushToUnTimedQueue(newNode: QueueNode) {
        // no element yet
        if (!this.headUnTimed) { 
            this.headUnTimed = newNode;
            this.tailUnTimed = newNode;
            this.headUnTimed.Next = undefined
            this.sizeUnTimedQ++;
            return;
        }
        
        newNode.Next = this.tailUnTimed?.Next;
        if (this.tailUnTimed)
            this.tailUnTimed.Next = newNode;

        this.tailUnTimed = newNode

        this.sizeUnTimedQ++;
    }

    private IsNewRecOlderThan(executionRecord: ExecutionsRecord, nodeToCompareWith: QueueNode): boolean {
        if (!executionRecord.TimeToExecute || !nodeToCompareWith.Data?.TimeToExecute)
            return false;

        const Datefirst: Date = executionRecord.TimeToExecute as Date;
        const DateSecond: Date = nodeToCompareWith.Data?.TimeToExecute as Date;

        return Datefirst.getTime() >= DateSecond.getTime();
    }
}