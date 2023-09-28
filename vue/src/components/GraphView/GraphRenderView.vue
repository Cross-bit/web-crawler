<template>
    <div v-if="true"
    id="container"
    class="d-flex flex-column justify-content-center align-items-center" 
    
    >    
    <div style="z-index: 1000" class="graph-top-menu">
      <div class="row">
      <div class="text-subtitle1 col-9" >Graph for record: {{recordId}}</div>
      <!--<div class="text-subtitle1 col-3" >Execution: </div>-->

      </div>
    <q-toggle color="blue" label="Live mode" v-model="isLiveMode" @update:model-value="liveModeChanged" val="blue" />
    <q-toggle color="blue" label="Domain view" v-model="isDomainView" @update:model-value="OnGraphViewChange" val="blue" />
    </div>
    <div>
    <div v-if="!hasGraphData" class="graph-data-error text-h2 text-grey ">No graph data available...</div>
    <div v-else-if="false" class="">Error loading graph data!</div>
    <div id="cy" class="cy">
    </div>
    </div>
    <!--<div id="domain-render-graph"></div>-->
    </div>
    <div v-else>
    <q-spinner color="primary" size="3em" />
    </div>
</template>

<script setup lang="ts">

import { ref, onMounted, computed } from 'vue'
import { useGraphsDataStore } from '../../stores/graphData'
import { useExecutionsStore } from '../../stores/executions';
import { useRecordsStore } from '../../stores/records/records';
import { storeToRefs } from 'pinia';

const recordsStore = useRecordsStore();

const graphDataStore = useGraphsDataStore();

const executionsDataStore = useExecutionsStore();

const hasGraphData = computed(() => graphDataStore.hasGraphdata);

const { currentGraphRecordId: recordId } = storeToRefs(graphDataStore);

const { isLiveMode } = storeToRefs(graphDataStore);
const { isDomainView } = storeToRefs(graphDataStore);


const syncGraphData = async () => {
  await executionsDataStore.syncLastExecutionsData(recordId.value);
  graphDataStore.connectToGraphDataSSE(recordsStore.getRecordById(recordId.value));
}

const liveModeChanged = (newToggleValue) => {

  if (newToggleValue)
    graphDataStore.connectToGraphDataSSE(recordsStore.getRecordById(recordId.value));
  else
    graphDataStore.disconnectFromGraphDataSSE();
}

syncGraphData();
const status = false;

const OnGraphViewChange = () => {
    graphDataStore.updateRenderedGraph();
}

onMounted(async () => {

  const graphContainer = document.getElementById('cy');
  graphDataStore.initiateRenderGraph(graphContainer);
 
});

</script>


<style lang="scss">
#container {
  position: relative;
  height: 100vh;
  width: 100%;
  border: 1px black solid;
}
#cy {
  position: absolute;
  height: 100%;
  width: 100%;
  border: 1px rgb(91, 91, 91) solid;
}
#domain-render-graph {
  position: absolute;
  height: 100%;
  width: 100%;
  border: 1px rgb(42, 42, 42) solid;
}
.graph-top-menu {
  position:absolute;
  margin: 10px;
}

.graph-data-error{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

</style>