<template>
    <q-page class="row items-center justify-evenly">
        <div class="col-lg-10 col-md-12 col-xs-12" >
            <ExecutionsTable class="q-mx-lg" />
        </div>
        <div class=" q-pa-lg col-12 col-md-4 row justify-center">
          <q-btn
            class=" col-6 col-md-12 q-my-xs q-mx-lg"
            outline
            rounded
            color="primary"
            label="Go home"
            to="/"
          ></q-btn>
          <q-btn
            class="col-6 col-md-12 q-my-xs q-mx-lg"
            outline
            rounded
            color="primary"
            label="View graph"
            icon="account_tree"
            @click="() => OnGraphViewButtonClick(recordId)"
          ></q-btn>
        </div>
    </q-page>
</template>

<script lang="ts">
import ExecutionsTable from '../components/ExecutionsTable/ExecutionsTable.vue'
import { useGraphsDataStore } from '../stores/graphData';
import { defineComponent, onBeforeMount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
    name: 'ExecutionsPage',
    components: { ExecutionsTable },

    setup() {
      const route = useRoute()
      const router = useRouter();
      const recordId = ref(-1);

      onBeforeMount(() => { 
        recordId.value = +(route.params.id)
      })

      const graphStore = useGraphsDataStore();

      const OnGraphViewButtonClick = async (recordId) => {

        router.push(`/graph/${recordId}`);
        await graphStore.disconnectFromGraphDataSSE();
        await graphStore.flushGraphData();

      }
    return {
      OnGraphViewButtonClick,
      recordId
    }
  },
  
})

</script>