import { defineStore } from "pinia";
import { api } from "../boot/axios"
import * as message from "../common/qusarNotify"



/**
 * DTO object of the execution we recieve from the API.
 */
export type ExecutionDTO = {
    id: number
    creation: Date
    executionStart: Date | null // can be null until the execution starts
    executionDuration: number
    state: string
    isTimed: boolean
    recordId: number
}

/**
 * Defines state of the executions store state.
 */
interface IExecutionsState
{
    lastExecutionId: number // last executed execution
    lastExecutionsData: ExecutionDTO[] // last executions data for lastly selected record
    currentEventSource: EventSource
    lastExecutionsRecordId: number,
}


/**
 * Keeps state of all executions to a specific record.
 */
export const useExecutionsStore = defineStore('executions', {
    state: (): IExecutionsState => ({
        lastExecutionId: -1,
        lastExecutionsData: [],
        currentEventSource: null,
        lastExecutionsRecordId: -1,
    }),
    getters: {
        getAllLastExecutions() {
            return 
        },
        getLastExecutionId(){
            return this.lastExecutionId;
        }
    },
    actions: {

        /**
         * 
         * SSE crawlers communication.
         * 
         */


        /**
         * Connects store to the crawlers API SSE, so if execution state changes, 
         * store is automatically informed and updated.
         * @param recordId Executions recordID.
         */
        async connectToExecutionsSSE(recordId: number) {

            this.lastExecutionsRecordId = recordId;

            const reqUrl = 'http://localhost:5000/api/v1/executions/sse'
            this.currentEventSource = new EventSource(reqUrl);
            this.currentEventSource.onopen = () => console.log('Connection to executions SSE opened.');
            this.currentEventSource.onerror = (error) => console.error(error);
            this.currentEventSource.onmessage = (event) => this.onNewExecutionsUpdate(event.data);
        },
        /**
         * Handles write of the new server side event if is raised. (callback for the onmessage sevent)
         * @param newExecutionData 
         * @returns void
         */
        async onNewExecutionsUpdate(newExecutionData: any) 
        {
            const executionData: ExecutionDTO = JSON.parse(newExecutionData) as ExecutionDTO;

            if (executionData && executionData.recordId == this.lastExecutionsRecordId) {
                
                for (let i = 0; i <= this.lastExecutionsData.length; i++) {
                    if (i == this.lastExecutionsData.length) { // execution not found   
                        this.lastExecutionsData.unshift(executionData);
                        return;
                    }

                    if (this.lastExecutionsData[i].id == executionData.id) // we found the data => update
                    {
                        this.lastExecutionsData[i] = executionData;
                        return;
                    }
                }

            }
        },
        /**
         * Disconnects store from the crawlers SSE API
         */
        async disconnectToExecutionsSSE(){
            this.currentEventSource.close(); 
        },
        /**
         * Updates last execution in the store state based on the last data that are in the store.
         * @returns void
         */
        SetLastExecutionIdBasedOnLastData()
        {
            if (this.lastExecutionsData.length <= 0)
                return;
            
            this.lastExecutionsData.sort((a, b) => b.id - a.id); // sort descending
            this.lastExecutionId = this.lastExecutionsData[0].id; // take top
        },
        /**
         * Synchronises all the executions records in the store with the database.
         * @param recordId Record id to which we want to get the data.
         */
        async syncLastExecutionsData(recordId: number) {
            try {
                this.lastExecutionsRecordId = recordId;

                const response = await api.get( `/records/${recordId}/executions`);
                
                this.lastExecutionsData = response.data;    
                this.SetLastExecutionIdBasedOnLastData();
            }
            catch(error) {
                message.error("Executions couldn't be synchronized, due to internal server error.");
                console.error(error);
            }
        }
    }
});