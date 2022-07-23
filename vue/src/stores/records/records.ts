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
    },
    actions: {
        async syncAllRecords(){
            api.get('/records').then(recordsRes => {
                this.recordsData = recordsRes.data;

            }).catch((error)=>{
                message.error("Records couldn't be synchronized, due to internal server error.");
                console.log(error);
            })
        },
        async addNewRecord(newRecordsData: APIRecord) {

            api.post('/records', newRecordsData).then(
                (response) => {
                    const { data } = response;
                    message.default('Record succesfully created!');

                this.syncAllRecords();
            }).catch((error)=>{
                message.error("Record couldn't be created, due to internal server error.");
                console.log(error);
            });
        },
        async updateRecords(recordId: number, updatedRecordsData: APIRecord) {

            const endPoint = `/records/${recordId}`

            api.patch(endPoint, updatedRecordsData).then( (response) => {
                this.syncAllRecords();
                message.default('Record succesfully updated!');
            }).catch((error) => {
                message.error("Record couldn't be updated, due to internal server error.");
                console.log(error);
            })
        },
        async deleteRecord(recordId: number) {
            const endPoint = `/records/${recordId}`
            api.delete(endPoint).then((response) =>{
            this.syncAllRecords();
        })
        }
    }
});