

import { GetAllPlannedExecutions } from '../../database/executionsDatabase'
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




/**
 *  Execution queue, that gives order in which executions will be executed for the given record.
 *  Higest priority has execution without periodicall updates.
 */
export class ExecutionsPriorityQueue2
{
    private head: QueueNode | undefined;
    private tailUnTimed: QueueNode | undefined; // points to the last untimed element
    private tail: QueueNode | undefined;
    private size: number;

    constructor() {
        this.size = 0;
    }

    private IsNewRecOlderThan(executionRecord: ExecutionsRecord, nodeToCompareWith: QueueNode): boolean {
        if (!executionRecord.TimeToExecute || !nodeToCompareWith.Data?.TimeToExecute)
            return false;

        const Datefirst: Date = executionRecord.TimeToExecute as Date;
        const DateSecond: Date = nodeToCompareWith.Data?.TimeToExecute as Date;

        return Datefirst.getTime() >= DateSecond.getTime();

    }

    Push (executionRecord: ExecutionsRecord) {
        const newNode = new QueueNode();
        newNode.Data = executionRecord;

        if (!this.head) { // no element yet
            this.head = newNode;
            this.tail = newNode;
            this.head.Next = undefined
            if (!executionRecord.IsTimed) // todo: refactor
                this.tailUnTimed = newNode;
            this.size++;
            return;
        }

        // For hypoteticall case where we have more timed executions for same record(which should not occure... todo:)
        if (executionRecord.IsTimed) { 
            
            let previous = undefined;
            let currentNode = this.tailUnTimed ? this.tailUnTimed.Next : this.head; // if we have some untimed executions => skip them
            

            while (currentNode != undefined && this.IsNewRecOlderThan(executionRecord, currentNode)) {
                previous = currentNode;
                currentNode = currentNode.Next as QueueNode;
            }
            
            if (previous == undefined) {
                // + add tailUnTimed handling todo:fix ...
                if (this.tailUnTimed) {
                    this.tailUnTimed.Next = newNode;
                    this.tail = newNode;
                }
                else
                {
                    this.head = newNode
                    newNode.Next = currentNode
                }
            }
            else {
                previous.Next = newNode
                newNode.Next = currentNode
            }

            if (currentNode == this.tail)
                this.tail = newNode;

            this.size++;

        }
        else {                
            
            if (this.tailUnTimed == this.tail) // implicitly set new tail if previoius was tail
                this.tail = newNode;

            // push it to the end of the untimed queue part
            if  (this.tailUnTimed) {
                newNode.Next = this.tailUnTimed.Next
                this.tailUnTimed.Next = newNode // original tail untimed
            }
            else
            {
                newNode.Next = this.head;
                this.head = newNode;
            }

            this.tailUnTimed = newNode

            this.size++;
        }
    }

    Pop (): ExecutionsRecord | undefined {
        //console.log(this.size)
        if (this.size > 0) this.size--;
        const headData = this.head?.Data;
        
        if (this.head == this.tailUnTimed)
            this.tailUnTimed = undefined

        if (this.head == this.tail)
            this.tail = undefined

        this.head = this.head?.Next;
        return headData;
    }

}




/**
 * Execution queue, that gives order in which executions will be executed for the given record.
 * Higest priority has Record with periodicall updates.
 * @deprecated The class should not be used
 */
export class ExecutionsPriorityQueueOld // this priority queue only handles items in 
{
    private head: QueueNode | undefined;
    private tail: QueueNode | undefined;
    private size: number;

    constructor() {
        this.size = 0;
    }

    private IsDateOlderThan(executionRecord: ExecutionsRecord, nodeToCompareWith: QueueNode): boolean {
        if (!executionRecord.TimeToExecute || !nodeToCompareWith.Data?.TimeToExecute)
            return false;

        const Datefirst: Date = executionRecord.TimeToExecute as Date;
        const DateSecond: Date = nodeToCompareWith.Data?.TimeToExecute as Date;

        return Datefirst.getTime() < DateSecond.getTime();

    }

    Push (executionRecord: ExecutionsRecord) {
        const newNode = new QueueNode();
        newNode.Data = executionRecord;

        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
            this.head.Next = this.tail
        }



        if (executionRecord.IsTimed) { // For hypoteticall case where we have more timed executions for same record(which should not occure...)
            let previous = undefined;
            let currentNode = this.head;
            
            while (currentNode?.Next != undefined && currentNode.Data?.IsTimed && this.IsDateOlderThan(executionRecord, currentNode)) {
                previous = currentNode;
                currentNode = currentNode.Next;
            }


            if (previous != undefined) {
                previous.Next = newNode;
                newNode.Next = currentNode;

                if (previous == this.tail)
                    this.tail = newNode;
                this.size++;
            }
        }
        else {                
            // push it to the end as in regular queue
            if  (this.tail)
                this.tail.Next = newNode;
            this.tail = newNode;

            this.size++;
        }
    }

    Pop (): ExecutionsRecord | undefined {
        if (this.size > 0) this.size--;
        return this.head?.Data;
    }

}