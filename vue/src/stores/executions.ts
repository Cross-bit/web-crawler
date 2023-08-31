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
}


export const useExecutionsStore = defineStore('executions', {
    state: (): IExecutionsState => ({
        lastExecutionId: -1,
        lastExecutionsData: []
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

        SetLastExecutionIdBasedOnLastData()
        {
            if (this.lastExecutionsData.length <= 0)
                return;
            
            this.lastExecutionsData.sort((a, b) => b.id - a.id); // sort descending
            this.lastExecutionId = this.lastExecutionsData[0].id; // take top
        },
        async syncLastExecutionsData(recordId: number) {
            try {
                
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