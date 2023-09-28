import { defineStore } from 'pinia';
import { api } from "../../boot/axios"
import { getRandomColor } from '../../utils/quasarColorUtils'

import * as message from '../../common/qusarNotify'

/**
 * Represents tags store state
 */
interface ITagsState {
  tagsData: [] | { label: string, value: number, color?: string }[]
  tagsSelected: number[]
}

/**
 * Defines maximum number of tags user can select for a givent record.
 */
const maxNumberOfSelectedTags = 5;


/**
 * Holds information 
 */
export const useTagsStore
 = defineStore('tags', {
  state: (): ITagsState => ({
    tagsData: [],
    tagsSelected: [],
  }),
  getters: {
    getTags: (state) => {
      if (state.tagsSelected.length == maxNumberOfSelectedTags){
        return state.tagsData.map(data => (!state.tagsSelected.includes(data.value) ? { ...data, disable: true} : { ...data, disable: false}))
      }
      
      return state.tagsData;
    },
    getAllTags: (state) => state.tagsData,
    getSelectedTags: (state) => state.tagsSelected,
    getMaxOfSelectedTags: () => maxNumberOfSelectedTags
  },
  actions: {
    /**
     * Adds single tag to the database.
     * @param newTagName 
     */
    async addOne(newTagName: string) {
      const tagNewColor = getRandomColor();
      await api.post('/tags', {
        name: newTagName,
        color: tagNewColor
        
       
      }).then((response) => {
        const { data } = response;
        this.tagsData.push({label:  data?.name, value: data?.id, color: tagNewColor})
      }).catch((error) => {
        const { response: {data} } = error;
        const { response: {status} } = error;

        if (status == 400) {
          message.warning(data?.error);
        }
        else if (status == 500) {
          message.error("Tags didn't updated properly due to server internal error!");

        }
        console.error('Tag insertion failed with following API errors:', data);
      })

    },
    /**
     * Gets all the data from the API and synchronises the store state.
     */
    async syncData() {
      try {
          const response = await api.get('/tags');
          this.tagsData = response.data.map(({name, id, color}) => ({ label: name, value: id, color: color}));
          console.log("after sync");
          console.log(this.tagsData);
        }
        catch (error){
          console.error('Tags data fetching failed with following api errors:', error);
        }
    },
    /**
     * Marks given tags state as selected.
     * @param tagsToSet 
     */
    setSelectedTags(tagsToSet: number[]) {
      this.tagsSelected = tagsToSet;
    },
    /**
     * Cleans all the selected tags.
     */
    cleanSelectedTags(){
      this.tagsSelected = [];
    }

  },
});
