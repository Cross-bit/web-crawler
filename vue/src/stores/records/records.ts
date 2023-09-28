import { defineStore, storeToRefs } from "pinia";
import { api } from "../../boot/axios"
import * as message from "../../common/qusarNotify"


/**
 * Types/interfaces definitions
*/


/**
 * Represents the API DTO for the records
*/
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

/**
 * Encapsulates the state of the store.
 */
interface RecordsState {
    recordsData: APIRecord[] | []
}

/**
 * Store represeting state of all created Records.
 */
export const useRecordsStore = defineStore('records', {
    state: (): RecordsState => ({
        recordsData: [],
    }),
    getters: {
        /**
         * Directly returns all the reocords currently in the store.
         * @param state 
         * @returns 
         */
        getAllRecords: (state) => state.recordsData,

        /**
         * Goes through all the records and returns the searched record by id.
         * @param state 
         * @returns function with parameter of the recordID
        */
        getRecordById: (state) => (recordId) => {

            for (let i = 0; i < state.recordsData.length; i++) {
                if(state.recordsData[i].id == recordId)
                    return state.recordsData[i];
            }
            
            return null;
        },
    },
    actions: {
        /**
        * Synchronises all the records with the database.
        */
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
        /**
         * Sends post request to create new record in the database.
         * Once the operation is succesfully done it synchronizes all the records in the store.
         * @param newRecordsData records DTO object
         * @returns Newly created records ID, or -1 if error occured.
         */
        async addNewRecord(newRecordsData: APIRecord): Promise<number> {
            try {
                const response = await api.post('/records', newRecordsData)
                const { data } = response;
                message.default('Record succesfully created!');

                this.syncAllRecords();
                return +(data.payload);
            }
            catch(error) {
                message.error("Record couldn't be created, due to internal server error.");
                console.error(error);
                return -1;
            }
        },
        /**
         * Sends patch request to update records data in the database.
         * Once the operation is succesfully done it synchronizes all the records in the store.
         * @param recordId Record to which we want the data to update.
         * @param updatedRecordsData record DTO with filled fields we want to update.
         */
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
        /**
         * Sends delete request to the API to remove record from the db.
         * Once the operation is done it synchronizes all the records in the store.
         * @param recordId Records ID to delete.
         */
        async deleteRecord(recordId: number) {
            const endPoint = `/records/${recordId}`

            api.delete(endPoint).then((response) =>{
                this.syncAllRecords();
            })
        },
        /**
         * Executes record by recordID.
         * @param recordId 
         */
        async executeRecord(recordId: number) {

            const endPoint = `/executions/${recordId}`

            api.post(endPoint).then(
                (response) => {
                    /*const { data } = response;*/
                    message.default('Record succesfully created!');
                //this.syncAllRecords();
            }).catch(( error )=>{
                message.error("Record couldn't be executed, due to internal server error.");
                console.error(error);
            });
        }

    }
});