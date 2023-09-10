<template>
  <q-page class="row items-center justify-evenly">

      <div class="col-lg-11 col-md-12 col-xs-12" ><records-table></records-table></div>
      <div class=" q-pa-lg col-12 col-md-4 row justify-center">
      </div>
  </q-page>
</template>

<script lang="ts">

  import RecordsTable from 'components/RecordsTable.vue';
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'IndexPage',
    components: { RecordsTable },
  });
</script>
