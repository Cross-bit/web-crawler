<template>
  <q-page class="row items-center justify-evenly">

      <div class="col-lg-10 col-md-12 col-xs-12" ><records-table></records-table></div>
      <div class=" q-pa-lg col-12 col-md-4 row justify-center">
        <q-btn
          class=" col-6 col-md-12 "
          outline
          rounded
          color="primary"
          label="Go graph view"
          to="/graph"
        ></q-btn>
        <q-btn
          class=" col-6 col-md-12 "
          outline
          rounded
          color="primary"
          label="Go executions view"
          :to="{ name: 'executions', params: { id: 1 } }"
        ></q-btn>
      </div>
  </q-page>
</template>

<script lang="ts">

  import RecordsTable from 'components/RecordsTable.vue';
  import { defineComponent, onMounted } from 'vue';
  import { useRoute } from 'vue-router'

  export default defineComponent({
    name: 'IndexPage',
    components: { RecordsTable },
  });
</script>
