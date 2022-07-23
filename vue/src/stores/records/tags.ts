import { defineStore } from 'pinia';
import { api } from "../../boot/axios"
import * as message from '../../common/qusarNotify'

interface ITagsState {
  tagsData: [] | { label: string, value: number }[]
  tagsSelected: number[]
}

const maxNumberOfSelectedTags = 5;

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
    async addOne(newTagName: string) {

      await api.post('/tags', {
        name: newTagName
      }).then((response)=>{
        const { data } = response;
        this.tagsData.push({label:  newTagName, value: data.insert_tags_one?.id})

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
    async syncData(){
      api.get('/tags').then((response) => {
          this.tagsData = response.data.map(({tag_name, id}) => ({ label: tag_name, value: id }));

        }).catch((error)=>{
        console.error('Tags data fetching failed with following api errors:', error);
      })
    },
    setSelectedTags(tagsToSet: number[]) {
      this.tagsSelected = tagsToSet;
    //  console.log(this.tagsSelected);
    },
    cleanSelectedTags(){
      this.tagsSelected = [];
    }

  },
});
