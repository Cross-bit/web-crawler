<template>
  <q-page class="row items-center justify-evenly">
  <executions-table></executions-table>
  </q-page>
</template>

<script lang="ts">
import ExecutionsTable from 'components/ExecutionsTable.vue';
import { defineComponent } from 'vue';

// GoJS: https://gojs.net/latest/index.html?ref=hackernoon.com na vizualizaci dat
// případně tady další alternativy: https://hackernoon.com/my-top-13-javascript-diagram-libraries-g2a53z6u

export default defineComponent({
  name: 'GraphPage',
  components: { ExecutionsTable },
});
</script>
