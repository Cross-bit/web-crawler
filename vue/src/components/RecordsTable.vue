<template>
  <div v-if="records">
    <q-table
      selection="single"
      v-model:selected="selected"
      :rows="records.record"
      :columns="columns"
      row-key="id"
    />
  </div>
  <div v-else>
    <q-spinner color="primary" size="3em" />
  </div>
  <NewRecordForm v-if="selected.length == 0" />
  <EditRecordForm v-else :record="{ ...selected[0] }" />
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar';
import { ref } from 'vue';
import NewRecordForm from './NewRecordForm.vue';
import EditRecordForm from './EditRecordForm.vue'
import { useAllRecordsQuery, Record } from '../graphql/_generated';

const columns: QTableProps['columns'] = [
  {
    name: 'url',
    label: 'URL',
    field: (row: Record) => row.url,
  },
  {
    name: 'label',
    label: 'Label',
    field: (row: Record) => row.label,
  },
  {
    name: 'boundary',
    label: 'Regex boundary',
    field: (row: Record) => row.boundary,
  },
  {
    name: 'periodicity',
    label: 'Periodicity (seconds)',
    field: (row: Record) => row.periodicity,
  },
  {
    name: 'active',
    label: 'Is active?',
    field: (row: Record) => row.active,
  },
];

const records = useAllRecordsQuery().data;
const selected = ref([])

</script>
