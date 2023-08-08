<template>
  <q-page class="row items-center justify-evenly">
  //todo:
  </q-page>
</template>

<script lang="ts">
//import ExecutionsTable from '../components/ExecutionsTable/ExecutionsTable.vue'
import { defineComponent, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router'

// GoJS: https://gojs.net/latest/index.html?ref=hackernoon.com na vizualizaci dat
// případně tady další alternativy: https://hackernoon.com/my-top-13-javascript-diagram-libraries-g2a53z6u

export default defineComponent({
  name: 'GraphPage',
  components: { },

  setup() {
      const route = useRoute()
      onBeforeMount(() => { 
        const id = route.params.id
      })
  }

});
</script>
