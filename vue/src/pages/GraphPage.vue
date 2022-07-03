<template>
  <q-page class="row items-center justify-evenly">
  <executions-table></executions-table>
  </q-page>
</template>

<script lang="ts">
import ExecutionsTable from 'components/ExecutionsTable.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'GraphPage',
  components: { ExecutionsTable },
});
</script>
