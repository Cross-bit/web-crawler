<template>
    <div v-if="true"
    id="container"
    class="d-flex flex-column justify-content-center align-items-center" 
    
    >
    <div v-if="status">
      afd {{ status }} {{ data }}
    </div>
    
    <div style="z-index: 1000" class="graph-top-menu">
      <div class="row">
      <div class="text-subtitle1 col-9" >Graph for record: {{recordId}}</div>
      <div class="text-subtitle1 col-3" >Execution: </div>

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

import { ref, onBeforeMount, onMounted, computed } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
import * as message from '../../common/qusarNotify'
import { api } from '../../boot/axios';
import * as cydagre from 'cytoscape-dagre';
import * as cytoscape from 'cytoscape'
import nodeHtmlLabel from 'cytoscape-node-html-label';
import klay from 'cytoscape-klay';
import coseBilkent from 'cytoscape-cose-bilkent';

cytoscape.use( klay );
cytoscape.use( coseBilkent );

import { useGraphsDataStore } from '../../stores/graphData'
import { useExecutionsStore } from '../../stores/executions';
import { useRecordsStore } from '../../stores/records/records';
import { storeToRefs } from 'pinia';

let executionsData = ref([]);

const recordsStore = useRecordsStore();

const graphDataStore = useGraphsDataStore();

const executionsDataStore = useExecutionsStore();

const hasGraphData = computed(() => graphDataStore.hasGraphdata);

const { currentGraphRecordId: recordId } = storeToRefs(graphDataStore);
console.log("here reloading " + recordId.value);

const { isLiveMode } = storeToRefs(graphDataStore);
//const { currentRenderGraph } = storeToRefs(graphDataStore)
console.log("nowa pavva 1");
const { isDomainView } = storeToRefs(graphDataStore);
console.log("nowa pavva 2");
const syncGraphData = async () => {

  console.log("here wating 0 ");
  await executionsDataStore.syncLastExecutionsData(recordId.value);
  
  console.log("here wating 1 ");
  const { lastExecutionId } = storeToRefs(executionsDataStore);

  /*console.log("tadyyy");
  console.log(recordsStore.getRecordById(recordId.value));*/
  console.log("hamamuta");
  console.log(recordId.value);
  console.log(recordsStore.getRecordById(recordId.value));
  graphDataStore.connectToGraphDataSSE(recordsStore.getRecordById(recordId.value));

}

const liveModeChanged = (newToggleValue) => {

  if (newToggleValue)
    graphDataStore.connectToGraphDataSSE(recordsStore.getRecordById(recordId.value));
  else
    graphDataStore.disconnectFromGraphDataSSE();
}
console.log("nowa pavva 3");
syncGraphData();
const status = false;

const OnGraphViewChange = () => {
    graphDataStore.updateRenderedGraph();
    /*cy.nodes().forEach(node => {
        node.style({
        'background-color': "red",
        'visibility': (node) => GetNodesVisibility(node.data('isGroupNode'), isDomainView.value)
        });
    })*/
}

onBeforeMount(async () => {
    try {
        const route = useRoute();
        const id = route.params.id
        
    }
    catch(error) {
        message.error("Executions couldn't be synchronized, due to internal server error.");
        console.error(error);
    }

})

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
  border: 1px orange solid;
}
#domain-render-graph {
  position: absolute;
  height: 100%;
  width: 100%;
  border: 1px orange solid;
}
.graph-top-menu {
  position:absolute;
}

.graph-data-error{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

</style>