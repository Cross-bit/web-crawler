<template>
    <div class="q-pa-md items-start q-gutter-md">
    <q-card v-if="lastTappedNode"  class="my-card" style="" >
        <q-card-section >
            <div class="text-h6">Node detail</div>
            <div><span class="text-subtitle1">URL: </span>{{ lastTappedNode?.url }}</div>
            <div id="additional-crawled-data" v-if="wasNodeCrawled" >
                <div class="text-subtitle2" >Crawl time:
                {{ lastTappedNode?.crawlTime }} ms</div>
            </div>
            <div id="errors" v-if="!wasNodeCrawled">
                <div class="text-subtitle2"  >Crawling errors:
                    <span class="q-mx-xs" v-for="error in lastTappedNode.errors" :key="error">
                        <q-badge color="red" >
                            {{ error }} 
                        </q-badge>
                    </span>
                </div>
            </div>
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section class="q-px-none"  v-if="wasNodeCrawled" >
            <div class="text-h6 text-center q-mb-md">Records crawled this site</div>
            <NodeDetailRecordTable :key="lastTappedNode.id"></NodeDetailRecordTable>
        </q-card-section>
        <q-card-actions align="right" v-if="wasRegexExceptionOnly">
            <q-btn @click="() => isNewRecordOpened = true" flat>Create new record</q-btn>
        </q-card-actions>
        <new-record-form  v-if="isNewRecordOpened" ></new-record-form>
     </q-card>
    </div>
</template>


<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref, watch, Ref } from 'vue'
import { useGraphsDataStore, ExecutionNode, RecordData } from '../../stores/graphData'
import NodeDetailRecordTable from './NodeDetailRecordTable.vue'
import NewRecordForm from '../RecordForms/NewRecordForm.vue'

const graphDataStore = useGraphsDataStore();

const { lastTappedNode }: { lastTappedNode: Ref<ExecutionNode> } = storeToRefs(graphDataStore);
const isNewRecordOpened = ref(false);

const wasNodeCrawled = ref(false); // lastTappedNode.value.errors?.includes('ok');
const wasRegexExceptionOnly = ref(false)

const { lastTappedNodeRecords }: { lastTappedNodeRecords: Ref<RecordData[]> } = storeToRefs(graphDataStore);


watch(
    lastTappedNode,
  (state) => {
    console.log("last state changed");
    console.log('co ty errory tady');
    wasNodeCrawled.value = lastTappedNode.value?.errors?.includes('ok');
    console.log(wasNodeCrawled.value);
    isNewRecordOpened.value = false;
    wasRegexExceptionOnly.value = (lastTappedNode.value?.errors?.includes('regex') && lastTappedNode.value?.errors?.length == 1);
  },
  { deep: true }
)


</script>