<template>
  <div v-if="records">
    <q-table
      selection="single"
      v-model:selected="selected"
      :rows="records.records"
      :columns="columns"
      row-key="id"
    />

  </div>
  <div v-else>
    <q-spinner color="primary" size="3em" />
  </div>
  <new-record-form v-if="selected.length == 0" ></new-record-form>
  <edit-record-form v-else :record="{ ...selected[0] }"></edit-record-form>
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar';
import { ref } from 'vue';

import NewRecordForm from './NewRecordForm.vue';
import EditRecordForm from './EditRecordForm.vue'
import { useAllRecordsQuery, Records } from '../graphql/_generated';



const columns: QTableProps['columns'] = [
  {
    name: 'url',
    label: 'URL',
    field: (row: Records) => row.url,
  },
  {
    name: 'label',
    label: 'Label',
    field: (row: Records) => row.label,
  },
  {
    name: 'boundary',
    label: 'Regex boundary',
    field: (row: Records) => row.boundary,
  },
  {
    name: 'periodicity',
    label: 'Periodicity (seconds)',
    field: (row: Records) => row.periodicity,
  },
  {
    name: 'active',
    label: 'Is active?',
    field: (row: Records) => row.active,
  },
];

const records = useAllRecordsQuery().data;
const selected = ref([])

</script>
