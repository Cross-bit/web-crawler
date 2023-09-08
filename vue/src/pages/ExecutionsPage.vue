<template>
    <q-page class="row items-center justify-evenly">
        <div class="col-lg-10 col-md-12 col-xs-12" ><records-table></records-table>
            <ExecutionsTable/>
        </div>
        <div class=" q-pa-lg col-12 col-md-4 row justify-center">
          <q-btn
            class=" col-6 col-md-12 "
            outline
            rounded
            color="primary"
            label="Go home"
            to="/"
          ></q-btn>
        </div>
    </q-page>
</template>

<script lang="ts">
import ExecutionsTable from '../components/ExecutionsTable/ExecutionsTable.vue'
import { defineComponent, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router'

export default defineComponent({
    name: "ExecutionsPage",
    components: { ExecutionsTable },

    setup() {
      const route = useRoute()
      onBeforeMount(() => { 
        const id = route.params.id
      })
  }
})

</script>