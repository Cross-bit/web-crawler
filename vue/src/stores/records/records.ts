import { defineStore } from "pinia";
import { api } from "../../boot/axios"


interface RecordsState {
    records: []
}

export const useRecordsStore = defineStore('records', {
    state: (): RecordsState => ({
        records: []
    }),
    getters: {
        getAllRecords: (state) => state.records
    },
    actions: {
        async addNewRecord() {
            /*api.post('/records', {

            });*/
        }
    }
});