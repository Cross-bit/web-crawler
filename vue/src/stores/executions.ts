import { defineStore } from "pinia";
import { api } from "../boot/axios"
import * as message from "../common/qusarNotify"
import Graph, {DirectedGraph} from "graphology"
//import { isGraph } from 'graphology-assertions';

export type ExecutionDTO = {
    id: number
    creation: Date
    executionStart: Date | null // can be null until the execution starts
    executionDuration: number
    state: string
    isTimed: boolean
    recordId: number
}

interface IExecutionsState
{
    lastExecutionId: number // last executed execution
    lastExecutionsData: ExecutionDTO[] // last executions data for lastly selected record
    currentEventSource: EventSource
    lastExecutionsRecordId: number,
}


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
        /*async syncLastExecutionId(recordId: number) {

        },*/
        async connectToExecutionsSSE(recordId: number) {

            this.lastExecutionsRecordId = recordId;

            const reqUrl = "http://localhost:5000/api/v1/executions/sse"
            this.currentEventSource = new EventSource(reqUrl);
            this.currentEventSource.onopen = () => console.log('Connection opened');
            this.currentEventSource.onerror = (error) => console.log(error);
            this.currentEventSource.onmessage = (event) => this.onNewExecutionsUpdate(event.data);
            

            return;
        },
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
        async disconnectToExecutionsSSE(){
            this.currentEventSource.close(); 
        },
        SetLastExecutionIdBasedOnLastData()
        {
            if (this.lastExecutionsData.length <= 0)
                return;
            
            this.lastExecutionsData.sort((a, b) => b.id - a.id); // sort descending
            this.lastExecutionId = this.lastExecutionsData[0].id; // take top
        },
        async syncLastExecutionsData(recordId: number) {
            try {

                this.lastExecutionsRecordId = recordId;

                //TODO: missing wrong recordId error
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