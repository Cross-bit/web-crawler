<template>
    <div class="q-pa-md items-start q-gutter-md">
    <q-card v-if="lastTappedNode"  class="my-card" style="" >
        <q-card-section >
            <div class="text-h6">Node detail</div>
            <div class="text-subtitle2">URL</div>
            <div >{{ lastTappedNode?.url }}</div>
            <div class="text-subtitle2">Crawl time</div>
            <div >{{ lastTappedNode?.crawlTime }}</div>
        </q-card-section>
        <NodeDetailRecordTable></NodeDetailRecordTable>
        <q-separator></q-separator>
    
        <q-card-actions align="right">
            <q-btn flat>Execute record</q-btn>
        </q-card-actions>
     </q-card>
    </div>
</template>


<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { watch, Ref } from 'vue'
import { useGraphsDataStore, ExecutionNode, RecordData } from '../../stores/graphData'
import NodeDetailRecordTable from './NodeDetailRecordTable.vue'

const graphDataStore = useGraphsDataStore();

const { lastTappedNode }: { lastTappedNode: Ref<ExecutionNode> } = storeToRefs(graphDataStore)
const { lastTappedNodeRecords }: { lastTappedNodeRecords: Ref<RecordData[]> } = storeToRefs(graphDataStore)

//const a: Ref<ExecutionNode> = lastTappedNode

//graphEventEmitter.value.on("doubleTappedNode", NodeDoubleTapped);


/*function NodeDoubleTapped(nodeData)
{
    console.log("from component");
    console.log(nodeData);
}*/

watch(
    lastTappedNode,
  (state) => {

    console.log(state);

  },
  { deep: true }
)


</script>