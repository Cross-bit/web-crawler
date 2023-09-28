<template>
    <q-table 
    :rows="lastTappedNodesRecordArr"
    :columns="columns"
    row-key="id" 
    :rowsPerPageOptions="[5]"
    >
    <template v-slot:body="props" >

    <q-tr :props="props">
        <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
        >

          <template v-if="col.name === 'executeBtn'">
          <q-btn round dense color="secondary" icon="arrow_right" size="md" 
              @click="onExecutionButtonClick(col.value)"
          >
              <q-tooltip class="bg-secondary" :offset="[0, 0]">
              Execute
              </q-tooltip>
          </q-btn>
          </template>
          <template v-else>
          {{ col.value }}
          </template>
        
        </q-td>
    
        <!--<q-td class="q-px-xs">
          <q-btn round dense color="primary" icon="search" size="md"
                  :to="`/executions/${props.row.id}`"
                  >
              <q-tooltip class="bg-indigo" :offset="[0, 0]">
              List executions
              </q-tooltip>
          </q-btn>
        </q-td>-->
        
    </q-tr>
    </template>
    </q-table>
</template>


<script setup lang="ts">
import { Ref } from 'vue'

import { QTableProps } from 'quasar';
import { storeToRefs } from 'pinia';
import { useGraphsDataStore, RecordData } from '../../stores/graphData'
import { useRecordsStore } from '../../stores/records/records';

const graphDataStore = useGraphsDataStore();
const recordsStore = useRecordsStore();

const { lastTappedNodesRecordArr }: { lastTappedNodesRecordArr: Ref<RecordData[]> } = storeToRefs(graphDataStore)

function onExecutionButtonClick(recordId: number) {
    recordsStore.executeRecord(recordId);
    return;
}

const columns: QTableProps['columns'] = [
  {
    name: 'url',
    label: 'URL',
    field: (row: RecordData) => row.url,
    align: 'center',
    sortable: true
  },
  {
    name: 'label',
    label: 'Label',
    field: (row: RecordData) => row.label,
    align: 'center',
    sortable: true,
  },
  {
    name: 'boundary',
    label: 'Boundary',
    field: (row: RecordData) => row.boundary,
    align: 'center',
    sortable: true,
  },
  {
    name: 'executeBtn',
    label: '',
    field: (row: RecordData) => row.id,
    align: 'center',
    sortable: true,
  },
];

</script>