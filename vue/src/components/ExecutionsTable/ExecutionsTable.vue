<template>
    <div v-if="executionsData" >
    <div class="row items-center">
        <div class="col-10">
          <h5 class="q-my-sm" >Executions for record (id: {{ recordId }}):</h5>
        </div>
        <div class="col-2">
         <!--<q-select
              dense
              options-dense
              filled
              v-model="executionsByLabelFilter"
              label="Filter by record label"
              multiple
              :options="allRecordsLabels"
              :loading="filterLoading"
              @virtual-scroll="onFilterScroll"
              outlined
          >
          <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
            <q-item v-bind="itemProps">
            <q-item-section>
                <q-item-label v-html="opt.label"></q-item-label>
            </q-item-section>
            <q-item-section side>
                <q-toggle :model-value="selected" @update:model-value="toggleOption(opt)"></q-toggle>
            </q-item-section>
            </q-item>
          </template>
          </q-select>-->
        </div>
    </div>
    <q-table
        binary-state-sort
        :key="lastExecutionsData.length"
        :rows="lastExecutionsData"
        :columns="columns"
        row-key="id"
        :rowsPerPageOptions="[5, 7, 10]"
        >
     <template v-slot:body="props" >

        <q-tr :props="props">

          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
          <template v-if="col.name === 'state'">
            <q-badge :color="stateColor[col.value]" :key="col.value" >{{ col.value }}</q-badge>
          </template>
          <template v-else-if="col.name === 'is_timed'">
            <RecordActiveTag :active="col.value" ></RecordActiveTag>
          </template>
          <template v-else>
            {{ col.value }}
          </template>
          </q-td>
  </q-tr>
</template>   
</q-table>
    <div class="col-9">
            <q-btn   color="primary" @click="onExecutionButtonClick()"> Execute </q-btn>

    </div>
    </div>
    <div v-else>
    <q-spinner color="primary" size="3em" />
    </div>
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar';
import { useExecutionsStore } from '../../stores/executions';
import { useRecordsStore } from '../../stores/records/records';
import { ref } from 'vue'
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import RecordActiveTag from '../Other/RecordActiveTag.vue'


const executionsStore = useExecutionsStore();
let executionsData = ref([]);


const recordsStore = useRecordsStore();

const { lastExecutionsData } = storeToRefs(executionsStore);

const route = useRoute();
const recordId = Number(route.params.id)

executionsStore.syncLastExecutionsData(recordId);

executionsStore.connectToExecutionsSSE(recordId);

/*const onFilterScroll = ({ to, ref }) => {
    // TODO:
}*/

function onExecutionButtonClick() {
  if (recordId)
    recordsStore.executeRecord(recordId);
}

console.log(executionsData);
const columns: QTableProps['columns'] = [
  {
    name: 'id',
    label: 'ID',
    field: (row) => row.id,
    sortable: true
  },
  {
    name: 'start_time',
    label: 'Start time',
    field: (row) => (new Date(row.executionStart)).toLocaleString() ,
    align: 'center',
    sortable: true
  },
  {
    name: 'duration',
    label: 'Duration',
    field: (row) => row.executionDuration + ' ms',
    align: 'center',
    sortable: true,
  },
  {
    name: 'state',
    label: 'State',
    field: (row) => row.state,
    align: 'center',
    sortable: true,
  },
  {
    name: 'is_timed',
    label: 'Is timed',
    field: (row) => row.isTimed,
    align: 'center',
    sortable: true,
  }
];

const stateColor =
{
  'created': 'lime',
  'planned': 'blue',
  'waiting': 'light-blue',
  'running': 'orange',
  'incomplete': 'deep-orange',
  'canceled': 'deep-orange',
  'done': 'green',
}



</script>
