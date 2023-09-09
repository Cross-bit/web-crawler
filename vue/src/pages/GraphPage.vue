<template>
  <q-page class="row items-center justify-evenly">
    <GraphView :key="currentRecordId" />
  </q-page>
</template>

<script lang="ts">
import GraphView from '../components/GraphView/GraphRenderView.vue'
import GraphPageLyout from './MyTemplate.vue'; 
import { useGraphsDataStore } from '../stores/graphData'
import { defineComponent, onBeforeMount,ref } from 'vue';
import { useRoute, onBeforeRouteUpdate } from 'vue-router'


export default defineComponent({
  name: 'GraphPage',
  components: { GraphView },

  setup() {

    
    const route = useRoute()
    const currentRecordId = ref(-1);

    const graphDataStore = useGraphsDataStore();

    onBeforeMount(() => { 
      currentRecordId.value = +(route.params.id)
    })


    onBeforeRouteUpdate(async (to, from) =>
    {
      const oldRecordId = from.params.id;
      const newRecordId = to.params.id;

      console.log("called before route");
      console.log("old record id " + oldRecordId);
      console.log("new record id " + newRecordId);

      await graphDataStore.disconnectFromGraphDataSSE();
      await  graphDataStore.flushGraphData();
      currentRecordId.value = +(newRecordId);

    })

    return {
      currentRecordId
    }
  }

});
</script>
