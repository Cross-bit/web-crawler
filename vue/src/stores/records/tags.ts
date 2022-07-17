import { defineStore } from 'pinia';
import { useInsertTagMutation } from '../../graphql/_generated'
import { api } from "../../boot/axios"


interface ITagsState {
  tagsData: [] | {label: string, value: number}[]
}

export const useTagsStore = defineStore('tags', {
  state: (): ITagsState => ({
    tagsData: []
  }),
  getters: {
    getTags: (state) => state.tagsData
  },
  actions: {
    async addOne(newTagName: string) {

      await api.post('/tags', {
        name: newTagName
      }).then((response)=>{
        const { data } = response;
        this.tagsData.push({label:  newTagName, value: data.insert_tags_one?.id})

      }).catch((error) => {
        console.error('Tag insertion failed with following API errors:', error);
      })
    },
    async syncData(){
      api.get('/tags').then((response)=>{
          this.tagsData = response.data.map(({tag_name, id}) => ({ label: tag_name, value: id }));

        }).catch((error)=>{
        console.error('Tags dat fetching failed with following api errors:', error);
      })
    }
  },
});
