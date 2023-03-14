import ExecutionQueuesManager from "../src/services/webCrawling/CrawlingExecution/ExecutionScheduling/executionQueueManager";
import ExecutionsRecord from "../src/services/webCrawling/CrawlingExecution/executionRecord"
import ExecutionsPriorityQueue from "../src/services/webCrawling/CrawlingExecution/ExecutionScheduling/executionsQueue";
import { IExecutionQueuesManager } from "../src/services/webCrawling/interface";


describe("Basic tests", () => {

    test("Check init size", () => {
        const qManager = new ExecutionQueuesManager();

        expect(qManager.GetQueuesCount()).toEqual(0);
    })

    test("Check size after insert", () => {

        const qManager = new ExecutionQueuesManager();


        const exeR = [
            new ExecutionsRecord(0, 42, true, new Date()),
            new ExecutionsRecord(1, 24, true, new Date()),
            new ExecutionsRecord(2, 25, true, new Date()),
            new ExecutionsRecord(3, 26, true, new Date()),
            new ExecutionsRecord(4, 27, true, new Date())
        ];

        exeR.forEach(record => qManager.InsertExecutionRecord({...record}));

        expect(qManager.GetQueuesCount()).toEqual(exeR.length);
    });


    test("Check size after remove", () => {

        const qManager = new ExecutionQueuesManager();

        const exeR = [
            new ExecutionsRecord(0, 42, true, new Date()),
            new ExecutionsRecord(1, 24, true, new Date()),
            new ExecutionsRecord(2, 25, true, new Date()),
            new ExecutionsRecord(3, 26, true, new Date()),
            new ExecutionsRecord(4, 27, true, new Date())
        ];

        exeR.forEach(record => qManager.InsertExecutionRecord({...record}));

        let returnValue = true;

        for(let i = 0; i <= 2; i++){
            returnValue = qManager.RemoveQueue(i) && returnValue;
        }

        expect(qManager.GetQueuesCount()).toEqual(2);
        expect(returnValue).toEqual(true);

    });

    test("Check size after remove all", () => {  
        const qManager = new ExecutionQueuesManager();

        const exeR = [
            new ExecutionsRecord(0, 42, true, new Date()),
            new ExecutionsRecord(1, 24, true, new Date()),
            new ExecutionsRecord(2, 25, true, new Date()),
            new ExecutionsRecord(3, 26, true, new Date()),
            new ExecutionsRecord(4, 27, true, new Date())
        ];

        exeR.forEach(record => qManager.InsertExecutionRecord({...record}));

        let returnValue = true;

        for (let i = 0; i < exeR.length; i++){
            returnValue = qManager.RemoveQueue(i) && returnValue;
        }

        expect(qManager.GetQueuesCount()).toEqual(0);
        expect(returnValue).toEqual(true);
    })

    test("Check remove too many", () => {

        const qManager = new ExecutionQueuesManager();

        const exeR = [
            new ExecutionsRecord(0, 42, true, new Date()),
            new ExecutionsRecord(1, 24, true, new Date()),
            new ExecutionsRecord(2, 25, true, new Date()),
            new ExecutionsRecord(3, 26, true, new Date()),
            new ExecutionsRecord(4, 27, true, new Date())
        ];

        exeR.forEach(record => qManager.InsertExecutionRecord({...record}));

        let returnValue = true;

        for (let i = 0; i <= exeR.length; i++){
            returnValue = qManager.RemoveQueue(i) && returnValue;
        }

        expect(qManager.GetQueuesCount()).toEqual(0);
        expect(returnValue).toEqual(false);
    });


    
    test("Check iteration moves and returns value", () => {

        const qManager = new ExecutionQueuesManager();

        const exeR = [
            new ExecutionsRecord(0, 42, true, new Date()),
            new ExecutionsRecord(1, 24, true, new Date()),
            new ExecutionsRecord(2, 25, true, new Date()),
            new ExecutionsRecord(3, 26, true, new Date()),
            new ExecutionsRecord(4, 27, true, new Date())
        ];

        exeR.forEach(record => qManager.InsertExecutionRecord({...record}));

        const elements: ExecutionsRecord[] = []
        const generator = qManager.GetNextQueue();

        for (let i = 0; i < exeR.length; i++){
            const queue = generator.next().value as ExecutionsPriorityQueue;
            const firstElement = queue.Pop();
            elements.push(firstElement as ExecutionsRecord);
        }

        expect(exeR).toEqual(elements);
    });


    test("Check iteration moves and returns values cyclic", () => {

        const qManager = new ExecutionQueuesManager();

        const exeR = [
            new ExecutionsRecord(0, 42, true, new Date()),
            new ExecutionsRecord(1, 24, true, new Date()),
            new ExecutionsRecord(2, 25, true, new Date()),
            new ExecutionsRecord(3, 26, true, new Date()),
            new ExecutionsRecord(4, 27, true, new Date())
        ];

        exeR.forEach(record => qManager.InsertExecutionRecord({...record}));

        const elements: ExecutionsRecord[] = []
        const generator = qManager.GetNextQueue();

        for (let i = 0; i < exeR.length*2; i++){
            const queue = generator.next().value as ExecutionsPriorityQueue;
            let element = queue.Pop() as ExecutionsRecord;
            const firstElement = { ...element };
            queue.Push(element);
            elements.push(firstElement as ExecutionsRecord);
        }

        expect(exeR.concat(exeR)).toEqual(elements);
    });

    /*
    TODO:
    test("Check iteration moves and returns values cyclic after delete", () => {

        const qManager = new ExecutionQueuesManager();

        const exeR = [
            new ExecutionsRecord(0, 42, true, new Date()),
            new ExecutionsRecord(1, 24, true, new Date()),
            new ExecutionsRecord(2, 25, true, new Date()),
            new ExecutionsRecord(3, 26, true, new Date()),
            new ExecutionsRecord(4, 27, true, new Date())
        ];

        exeR.forEach(record => qManager.InsertExecutionRecord({...record}));

        const elements: ExecutionsRecord[] = []
        const generator = qManager.GetNextQueue();

        for (let i = 0; i < exeR.length; i++){
            const queue = generator.next().value as ExecutionsPriorityQueue;
            let element = queue.Pop() as ExecutionsRecord;
            const firstElement = { ...element };
            queue.Push(element);
            elements.push(firstElement as ExecutionsRecord);
        }

        expect(exeR.concat(exeR)).toEqual(elements);
    });*/

})
