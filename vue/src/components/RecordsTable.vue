<template>
  <div class="col row justify-center ">
    <div class="col-12 col-md-7 q-px-lg q-mb-lg">
      <div v-if="records">
        <q-table
          title="Web pages records"
          selection="single"
          v-model:selected="selected"
          :rows="records.records"
          :columns="columns"
          row-key="id"
          :rowsPerPageOptions="[5, 7, 10]"
        />
      </div>
      <div v-else>
        <q-spinner color="primary" size="3em" />
      </div>
    </div>

    <div class="col-12 q-px-xl col-md-5 col-10">
      <new-record-form v-if="selected.length == 0" ></new-record-form>
      <edit-record-form v-else :record="{ ...selected[0] }"></edit-record-form>
    </div>
  </div>
</template>

<script setup lang="ts">

import { QTableProps } from 'quasar';
import { ref } from 'vue';

import NewRecordForm from './NewRecordForm.vue';
import EditRecordForm from './EditRecordForm.vue'
import { useAllRecordsDataQuery, Tags_Records_Relations, Records } from '../graphql/_generated';
import { Result } from 'postcss';

import { defineComponent } from 'vue';

const result = useAllRecordsDataQuery();

const columns: QTableProps['columns'] = [
  {
    name: 'url',
    label: 'URL',
    field: (row: Records) => row.url,
    align: 'left',
  },
  {
    name: 'label',
    label: 'Label',
    field: (row: Records) => row.label,
    align: 'center',
  },
  {
    name: 'boundary',
    label: 'Regex boundary',
    field: (row: Records) => row.boundary,
    align: 'center'
  },
  {
    name: 'periodicity',
    label: 'Periodicity (seconds)',
    field: (row: Records) => row.periodicity,
    align: 'center'
  },
  {
    name: 'tag',
    label: 'Tags',
    field: (row: Records) => row.tags_records_relations.reduce((previousValue: string, currentValue: Tags_Records_Relations) => previousValue + (previousValue !== '' ? ', ' : '')  + currentValue.tag.tag_name, ''),
    // todo: přepsat čistěji do helper funkce
    align: 'center'
  },
  {
    name: 'active',
    label: 'Is active?',
    field: (row: Records) => row.active,
    align: 'center'
  },
];

const records = useAllRecordsDataQuery().data;
const selected = ref([])

</script>
