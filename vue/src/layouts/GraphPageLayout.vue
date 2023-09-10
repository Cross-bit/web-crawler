
<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          Graph view
        </q-toolbar-title>
        <q-btn
          color="primary"
          label="Records"
          to="/"
        ></q-btn>
        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <RecordsSideBar @close="onRecordActiveSelectionChanged" />
    </q-drawer>

    <q-drawer show-if-above v-model="rightDrawerOpen" :width="560" side="right" bordered>
      <!-- drawer content -->
      <NodeDetail />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useGraphsDataStore } from '../stores/graphData'
import RecordsSideBar from '../components/GraphView/RecordsSideBar.vue'
import NodeDetail from '../components/GraphView/NodeDetailSideBar.vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

export default {
  setup () {
    const leftDrawerOpen = ref(false)
    const graphDataStore = useGraphsDataStore();
    const { isNodeDetailOpen: rightDrawerOpen } = storeToRefs(graphDataStore);

    const route = useRoute();

    const currentRecordId = ref(+(route.params.id));
    
    return {
      leftDrawerOpen,
      rightDrawerOpen,
      currentRecordId,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      toggleRightDrawer () {
        rightDrawerOpen.value = !rightDrawerOpen.value
      },
      onRecordActiveSelectionChanged(newId: number) {
        /*console.log(graphDataStore);
        graphDataStore.flushGraphData();
        graphDataStore.connectToGraphDataSSE(newId);*/
       // currentRecordId.value = newId;
      },
    }
  },
  components: {RecordsSideBar, NodeDetail}
}
</script>