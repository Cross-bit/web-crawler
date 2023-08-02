<template>
    <div v-if="executionsData" >
    <div class="row items-center">
        <div class="col-8"><h5 class="q-my-sm" >Executions:</h5></div>
        <div class="col-4">
        <q-select
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
        </q-select>
        </div>
    </div>
    <q-table
        selection="single"
        :rows="executionsData"
        :columns="columns"
        row-key="id"
        :rowsPerPageOptions="[5, 7, 10]"
    />
    </div>
    <div v-else>
    <q-spinner color="primary" size="3em" />
    </div>
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar';
import { ref, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router';
import { api } from '../../boot/axios';
import * as message from "../../common/qusarNotify"

let executionsData = ref([]);
const executionsByLabelFilter = ref('')
const allRecordsLabels = ref(['dumb'])
const filterLoading = ref(false)

const onFilterScroll = ({ to, ref }) => {
    // todo
}

const selectedExecutions = "selected"


onBeforeMount(async () => {
    try {
        const route = useRoute();
        const id = route.params.id

        const response = await api.get( `/records/${id}/executions`)
        executionsData.value = response.data;
        
    }
    catch(error) {
        message.error("Executions couldn't be synchronized, due to internal server error.");
        console.error(error);
    }

})

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
    field: (row) => row.executionDuration,
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
  /*{
    name: 'tag',
    label: 'Tags',
    field: (row) => row.tags.map(tagData => tagData),
    //format: (val, row) => val.sort().join(', '),
    align: 'center',
    sortable: true,
  }*/
];
  //<q-btn round color="secondary" icon="double_arrow"></q-btn>
const selected = ref([])




</script>
