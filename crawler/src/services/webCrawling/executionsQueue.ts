

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
 * Execution queue, that gives order in which executions will be executed for the given record.
 * Higest priority has Record with periodicall updates.
 */
export default class ExecutionsPriorityQueue
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
            while(currentNode?.Next != undefined && currentNode.Data?.IsTimed && this.IsDateOlderThan(executionRecord, currentNode)) {
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