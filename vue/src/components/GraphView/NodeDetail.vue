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
        <q-separator></q-separator>
        <q-card-section class="q-px-none">
            <div class="text-h6 text-center q-mb-md">Records crawled this site</div>
            <NodeDetailRecordTable :key="lastTappedNode.id"></NodeDetailRecordTable>
            <new-record-form></new-record-form>
        </q-card-section>
        <q-card-actions align="right">
            <q-btn flat>Create new record</q-btn>
        </q-card-actions>
     </q-card>
    </div>
</template>


<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { watch, Ref } from 'vue'
import { useGraphsDataStore, ExecutionNode, RecordData } from '../../stores/graphData'
import NodeDetailRecordTable from './NodeDetailRecordTable.vue'
import NewRecordForm from '../RecordForms/NewRecordForm.vue'

const graphDataStore = useGraphsDataStore();

const { lastTappedNode }: { lastTappedNode: Ref<ExecutionNode> } = storeToRefs(graphDataStore)
const { lastTappedNodeRecords }: { lastTappedNodeRecords: Ref<RecordData[]> } = storeToRefs(graphDataStore)


watch(
    lastTappedNode,
  (state) => {
    console.log("last state changed");
    console.log(lastTappedNodeRecords);

  },
  { deep: true }
)


</script>