import { defineStore, storeToRefs } from "pinia";
import { api } from "../../boot/axios"
import * as message from "../../common/qusarNotify"

interface RecordsState {
    recordsData: APIRecord[] | []
}

export interface APIRecord {
    id?: number
    label?: string,
    url?: string,
    boundary?: string,
    periodicity_min?: number,
    periodicity_hour?: number,
    periodicity_day?: number,
    periodicity?: number,
    active?: boolean,
    tags?: {name: string, id: number}[] | number[]
}

export const useRecordsStore = defineStore('records', {
    state: (): RecordsState => ({
        recordsData: [],
    }),
    getters: {
        getAllRecords: (state) => state.recordsData,
        getRecordById: (state) => (recordId) => {

            for (let i = 0; i < state.recordsData.length; i++) {
                if(state.recordsData[i].id == recordId)
                    return state.recordsData[i];
            }
            
            return null;
        },
    },
    actions: {
        async syncAllRecords() {
            try {
                const response = await api.get('/records')
                this.recordsData =response.data;
            }
            catch(error) {
                message.error("Records couldn't be synchronized, due to internal server error.");
                console.error(error);
            }
        },
        async addNewRecord(newRecordsData: APIRecord) {
            api.post('/records', newRecordsData).then(
                (response) => {
                    const { data } = response;
                    message.default('Record succesfully created!');

                this.syncAllRecords();
            }).catch((error)=>{
                message.error("Record couldn't be created, due to internal server error.");
                console.error(error);
            });
        },
        async updateRecords(recordId: number, updatedRecordsData: APIRecord) {

            const endPoint = `/records/${recordId}`

            api.patch(endPoint, updatedRecordsData).then((response) => {
                this.syncAllRecords();
                message.default('Record succesfully updated!');
            }).catch((error) => {
                message.error("Record couldn't be updated, due to internal server error.");
                console.error(error);
            })
        },
        async deleteRecord(recordId: number) {
            const endPoint = `/records/${recordId}`
            api.delete(endPoint).then((response) =>{
            this.syncAllRecords();
        })
        },
        async executeRecord(recordId: number) {

            const endPoint = `/executions/${recordId}`

            console.log("executed record " + recordId);

            api.post(endPoint).then(
                (response) => {
                    /*const { data } = response;
                    message.default('Record succesfully created!');*/

                //this.syncAllRecords();
            }).catch(( error )=>{
                message.error("Record couldn't be executed, due to internal server error.");
                console.error(error);
            });
        }

    }
});