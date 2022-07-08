<template>
  <q-page class="row items-center justify-evenly">
      <records-table></records-table>
      <q-btn
        outline
        rounded
        color="primary"
        label="Go graph view"
        to="/graph"
        ></q-btn>
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
