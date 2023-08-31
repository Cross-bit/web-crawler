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
    <div id="cy" class="cy"></div>
    <!--<div id="domain-render-graph"></div>-->
    </div>
    <div v-else>
    <q-spinner color="primary" size="3em" />
    </div>
</template>

<script setup lang="ts">

import { ref, onBeforeMount, onMounted } from 'vue'
import { useRoute } from 'vue-router';
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
import { storeToRefs } from 'pinia';

let executionsData = ref([]);

const graphDataStore = useGraphsDataStore();

const executionsDataStore = useExecutionsStore();

const { currentGraphRecordId: recordId } = storeToRefs(graphDataStore);

const { isLiveMode } = storeToRefs(graphDataStore);
//const { currentRenderGraph } = storeToRefs(graphDataStore)

const { isDomainView } = storeToRefs(graphDataStore);

const syncGraphData = async () => {
  await executionsDataStore.syncLastExecutionsData(recordId.value);
  
  const { lastExecutionId } = storeToRefs(executionsDataStore);
  
  graphDataStore.connectToGraphDataSSE(recordId.value/*, lastExecutionId.value*/);

}

const liveModeChanged = (newToggleValue) => {

  if (newToggleValue)
    graphDataStore.connectToGraphDataSSE(recordId.value);
  else
    graphDataStore.disconnectFromGraphDataSSE();
}

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
</style>