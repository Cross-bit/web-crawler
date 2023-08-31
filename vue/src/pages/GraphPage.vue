<template>
  <q-page class="row items-center justify-evenly">
    <GraphView />
  </q-page>
</template>

<script lang="ts">
import GraphView from '../components/GraphView/GraphRenderView.vue'
import GraphPageLyout from './MyTemplate.vue'; 
import { defineComponent, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router'


export default defineComponent({
  name: 'GraphPage',
  components: { GraphView },

  setup() {

      const route = useRoute()
      onBeforeMount(() => { 
        const id = route.params.id
      })
  }

});
</script>
