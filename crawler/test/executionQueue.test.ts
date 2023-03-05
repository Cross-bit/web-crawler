import ExecutionQueue from "../src/services/webCrawling/executionsQueue"
import ExecutionsRecord from "../src/services/webCrawling/executionRecord"


describe("Basic enque and pop tests", () => {
    

    test("Enqeue timed elements only", () => {
        let executionQueue = new ExecutionQueue();
        const records: ExecutionsRecord[] = [
            new ExecutionsRecord(
                1,
                0,
                true,
                new Date(2022, 0, 1, 12, 30),
            ),
            new ExecutionsRecord(
                2,
                1,
                true,
                new Date(2022, 0, 1, 12, 45),
            ),
            new ExecutionsRecord(
                3,
                42,
                true,
                new Date(2022, 0, 1, 13, 30),
            ),
            new ExecutionsRecord(
                0,
                24,
                true,
                new Date(2022, 0, 1, 11, 10),
            )
        ]

        records.forEach((record) => {
            executionQueue.Push(record);
        })

        const expectedIdsOrder = [0, 1, 2, 3];
        let resultedIds = []
        for(let i = 0; i < records.length; i++) {
            const current = executionQueue.Pop()
            resultedIds.push(current?.recordID)
            
        }

        expect(resultedIds).toEqual(expectedIdsOrder);
    });

    test("Enqeue not timed elements only", () => {
        let executionQueue = new ExecutionQueue();

        const records: ExecutionsRecord[] = [
            new ExecutionsRecord(
                0,
                0,
                false,
                new Date(2022, 0, 1, 12, 30),
            ),
            new ExecutionsRecord(
                1,
                1,
                false,
                new Date(2022, 0, 1, 12, 45),
            ),
            new ExecutionsRecord(
                2,
                42,
                false,
                new Date(2022, 0, 1, 13, 30),
            ),
            new ExecutionsRecord(
                3,
                24,
                false,
                new Date(2022, 0, 1, 11, 10),
            )
        ]

        records.forEach((record) => {
            executionQueue.Push(record);
        })

        const expectedIdsOrder = [0, 1, 2, 3];
        let resultedIds = []
        
        for(let i = 0; i < records.length; i++) {
            const current = executionQueue.Pop()
            resultedIds.push(current?.recordID)
            
        }
      
        expect(resultedIds).toEqual(expectedIdsOrder);
    });

    test("Enqeue firstly timed and then not timed elements", () => {
        let executionQueue = new ExecutionQueue();

        const records: ExecutionsRecord[] = [
            new ExecutionsRecord(
                1,
                1,
                true,
                new Date(2022, 0, 1, 12, 45),
            ),
            new ExecutionsRecord(
                0,
                0,
                true,
                new Date(2022, 0, 1, 12, 30),
            ),
            new ExecutionsRecord(
                2,
                42,
                false,
                new Date(2022, 0, 1, 13, 30),
            ),
            new ExecutionsRecord(
                3,
                24,
                false,
                new Date(2022, 0, 1, 11, 10),
            )
        ]

        records.forEach((record) => {
            executionQueue.Push(record);
        })

        const expectedIdsOrder = [2, 3, 0, 1];
        let resultedIds = []
        for(let i = 0; i < records.length; i++) {
            const current = executionQueue.Pop()
            resultedIds.push(current?.recordID)
            
        }

        expect(resultedIds).toEqual(expectedIdsOrder);
    });


    test("Enqeue firstly untimed and then timed elements", () => {
        let executionQueue = new ExecutionQueue();

        const records: ExecutionsRecord[] = [
            new ExecutionsRecord(
                2,
                42,
                false,
                new Date(2022, 0, 1, 13, 30),
            ),
            new ExecutionsRecord(
                3,
                24,
                false,
                new Date(2022, 0, 1, 11, 10),
            ),
            new ExecutionsRecord(
                1,
                1,
                true,
                new Date(2022, 0, 1, 12, 45),
            ),
            new ExecutionsRecord(
                0,
                0,
                true,
                new Date(2022, 0, 1, 12, 30),
            )
        ]

        records.forEach((record) => {
            executionQueue.Push(record);
        })

        const expectedIdsOrder = [2, 3, 0, 1];
        let resultedIds = []
        for(let i = 0; i < records.length; i++) {
            const current = executionQueue.Pop()
            resultedIds.push(current?.recordID)
            
        }
       // console.log(resultedIds)
        
        expect(resultedIds).toEqual(expectedIdsOrder);
    });


    test("Enqeue untimed and timed elements randomly", () => {
        let executionQueue = new ExecutionQueue();

        const records: ExecutionsRecord[] = [
            new ExecutionsRecord(
                0,
                0,
                true,
                new Date(2022, 0, 1, 12, 30),
            ),
            new ExecutionsRecord(
                3,
                24,
                false,
                new Date(2022, 0, 1, 11, 10),
            ),
            new ExecutionsRecord(
                2,
                42,
                false,
                new Date(2022, 0, 1, 13, 30),
            ),
            new ExecutionsRecord(
                1,
                1,
                true,
                new Date(2022, 0, 1, 12, 45),
            ),
            new ExecutionsRecord(
                4,
                42,
                false,
                new Date(2022, 0, 1, 13, 30),
            ),
        ]

        records.forEach((record) => {
            executionQueue.Push(record);
        })

        const expectedIdsOrder = [3, 2, 4, 0, 1];
        let resultedIds = []
        for(let i = 0; i < records.length; i++) {
            const current = executionQueue.Pop()
            resultedIds.push(current?.recordID)
            
        }
        //console.log(resultedIds)
        
        expect(resultedIds).toEqual(expectedIdsOrder);
    });

    test("Enqeue pop n-1 enque again timed only", () => {
        let executionQueue = new ExecutionQueue();

        const records: ExecutionsRecord[] = [
            new ExecutionsRecord(
                1,
                0,
                true,
                new Date(2022, 0, 1, 12, 30),
            ),
            new ExecutionsRecord(
                2,
                1,
                true,
                new Date(2022, 0, 1, 12, 45),
            ),
            new ExecutionsRecord(
                3,
                42,
                true,
                new Date(2022, 0, 1, 13, 30),
            ),
            new ExecutionsRecord(
                0,
                24,
                true,
                new Date(2022, 0, 1, 11, 10),
            )
        ]

        records.forEach((record) => {
            executionQueue.Push(record);
        })
        
        // pop n-1 items
        for(let i = 0; i < records.length - 1; i++) {
            executionQueue.Pop()?.recordID;
        }

        executionQueue.Print();

        records.forEach((record) => {
            executionQueue.Push(record);
        })
        
        const expectedIdsOrder = [0, 1, 2, 3, 3];
        let resultedIds = []
        for(let i = 0; i < records.length + 1; i++) {
            const current = executionQueue.Pop();
            resultedIds.push(current?.recordID);
            
        }
        
        expect(resultedIds).toEqual(expectedIdsOrder);
    });


    test("Enqeue pop n-1 enque again untimed only", () => {
        let executionQueue = new ExecutionQueue();

        const records: ExecutionsRecord[] = [
            new ExecutionsRecord(
                1,
                0,
                false,
                new Date(2022, 0, 1, 12, 30),
            ),
            new ExecutionsRecord(
                2,
                1,
                false,
                new Date(2022, 0, 1, 12, 45),
            ),
            new ExecutionsRecord(
                3,
                42,
                false,
                new Date(2022, 0, 1, 13, 30),
            ),
            new ExecutionsRecord(
                0,
                24,
                false,
                new Date(2022, 0, 1, 11, 10),
            )
        ]

        records.forEach((record) => {
            executionQueue.Push(record);
        })
        
        // pop n-1 items
        for(let i = 0; i < records.length - 1; i++) {
            executionQueue.Pop()?.recordID;
        }

        //executionQueue.Print();

        records.forEach((record) => {
            executionQueue.Push(record);
        })
        
        const expectedIdsOrder = [0, 1, 2, 3, 0];
        let resultedIds = []
        for(let i = 0; i < records.length + 1; i++) {
            const current = executionQueue.Pop();
            resultedIds.push(current?.recordID);
            
        }
        
        expect(resultedIds).toEqual(expectedIdsOrder);
    });

    test("Enqeue pop n-1 enque again untimed and timed randomly", () => {
        let executionQueue = new ExecutionQueue();

        const records: ExecutionsRecord[] = [
            new ExecutionsRecord(
                1,
                0,
                false,
                new Date(2022, 0, 1, 12, 30),
            ),
            new ExecutionsRecord(
                2,
                1,
                true, // 1 3 0 2 2
                new Date(2022, 0, 1, 12, 45),
            ),
            new ExecutionsRecord(
                3,
                42,
                false,
                new Date(2022, 0, 1, 13, 30),
            ),
            new ExecutionsRecord(
                0,
                24,
                true,
                new Date(2022, 0, 1, 11, 10),
            )
        ]

        records.forEach((record) => {
            executionQueue.Push(record);
        })
        
        // pop n-1 items
        for(let i = 0; i < records.length - 1; i++) {
            executionQueue.Pop()?.recordID;
        }

        executionQueue.Print();

        records.forEach((record) => {
            executionQueue.Push(record);
        })
        
        const expectedIdsOrder = [1, 3, 0, 2, 2];
        let resultedIds = []
        for(let i = 0; i < records.length + 1; i++) {
            const current = executionQueue.Pop();
            resultedIds.push(current?.recordID);   
        }
        
        expect(resultedIds).toEqual(expectedIdsOrder);
    });



  });