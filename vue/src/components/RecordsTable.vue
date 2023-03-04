<template>
  <div class="col row justify-center ">
    <div class="col-12 col-md-7 q-px-lg q-mb-lg">
      <div v-if="recordsData" >
        <div class="row items-center">
          <div class="col-8"><h5 class="q-my-sm" >Web records:</h5></div>
          <div class="col-4">
            <q-select
              dense
              options-dense
              filled
              v-model="tagsFilterSelected"
              label="Filter by tag"
              multiple
              :options="options"
              :loading="loading"
              @virtual-scroll="onScroll"
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
          :filter="filter"
          :filter-method="filteredResults"
          v-model:selected="selected"
          :rows="recordsData"
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
      <edit-record-form v-else :record="{ ...selected[0] }" :key="selected[0].id" @onDelete="() => selected = []" ></edit-record-form>
    </div>
  </div>
</template>

<script setup lang="ts">

import { QTableProps } from 'quasar';
import { ref, computed,  nextTick } from 'vue';

import NewRecordForm from './RecordForms/NewRecordForm.vue';
import EditRecordForm from './RecordForms/EditRecordForm.vue'
import { storeToRefs } from 'pinia';
import { useRecordsStore, APIRecord } from '../stores/records/records';
import { useTagsStore } from '../stores/records/tags';

const tagsStore = useTagsStore();
const {tagsData} = storeToRefs(tagsStore)

const tagsFilterSelected = ref(null)

const loading = ref(false);
const recordsStore = useRecordsStore();
const { recordsData } = storeToRefs(recordsStore)

recordsStore.syncAllRecords();

const nextPage = ref(2);
const pageSize = 3
const lastPage = Math.ceil(tagsData.value.length / pageSize)

const options = computed(() => tagsData.value.slice(0, pageSize * (nextPage.value - 1)))

const filter = ref('active');

const filteredResults = () => {
  return recordsData.value.filter(filterFunction)
}

// todo: hodit to do samostatné component
const filterFunction =  (row: APIRecord) => {

  if (tagsFilterSelected.value === null || tagsFilterSelected.value.length == 0)
    return true;

  const tags = (row.tags as {name: string, id: number}[]);

  return tagsFilterSelected.value.find(selectedTags => tags.filter(recordTags => +selectedTags.value == recordTags.id ).length > 0) !== undefined
}

const onScroll = ({ to, ref }) => {

  const lastIndex = options.value.length - 1

  console.log(nextPage.value  + " " + lastPage);

  if (loading.value !== true && nextPage.value < lastPage && to === lastIndex) {
          loading.value = true

    setTimeout(() => {
      nextPage.value++
      nextTick(() => {
        ref.refresh()
        loading.value = false
      })
    }, 500)
  }
}


const columns: QTableProps['columns'] = [
  {
    name: 'url',
    label: 'URL',
    field: (row: APIRecord) => row.url,
    align: 'left',
    sortable: true
  },
  {
    name: 'label',
    label: 'Label',
    field: (row: APIRecord) => row.label,
    align: 'center',
    sortable: true,
  },
  {
    name: 'boundary',
    label: 'Boundary',
    field: (row: APIRecord) => row.boundary,
    align: 'center',
    sortable: true,
  },
  {
    name: 'periodicity',
    label: 'Periodicity (m:h:d)',
    field: (row: APIRecord) => `${row.periodicity_min} : ${row.periodicity_hour} : ${row.periodicity_day}`,
    align: 'center',
    sortable: true,
  },
  {
    name: 'tag',
    label: 'Tags',
    field: (row: APIRecord) => row.tags.map(tagData => tagData.name),
    format: (val, row) => val.sort().join(', '),
    align: 'center',
    sortable: true,
  },
  {
    name: 'active',
    label: 'Is active?',
    field: (row: APIRecord) => row.active,
    align: 'center',
    sortable: true,
  },
];

const selected = ref([])

</script>
