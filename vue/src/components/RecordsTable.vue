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
              multiple
              label="Filter by tag"
              :options="options"
              :loading="loading"
              @virtual-scroll="onScroll"
              outlined>
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
        >
         

        <template v-slot:body="props" >

          <q-tr :props="props">
            <q-td auto-width  >
              <q-checkbox
                v-model="props.selected"
                :color="props.color"
              />
            </q-td>
  
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
            
              <template v-if="col.name === 'tag'">
                <q-badge :color="tag.color" :key="tag" v-for="tag in col.value">{{ tag.name }}</q-badge>
              </template>
              <template v-else-if="col.name === 'executeBtn'">
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
           
              <q-td class="q-px-xs">
                <q-btn round dense color="primary" icon="search" size="md"
                      :to="`/executions/${props.row.id}`"
                      >
                  <q-tooltip class="bg-indigo" :offset="[0, 0]">
                    List executions
                  </q-tooltip>
                </q-btn>
              </q-td>
              <q-td class="q-px-xs">
                <q-btn round dense color="orange" icon="account_tree" size="md" 
                  :to="`/graph/${props.row.id}`">
                  <q-tooltip class="orange" :offset="[0, 0]">
                    View graph
                  </q-tooltip>
                </q-btn>
                
              </q-td>
          </q-tr>
        </template>

        </q-table>

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
import { ref, computed, nextTick } from 'vue';
import { onBeforeMount, watchEffect } from 'vue'

import NewRecordForm from './RecordForms/NewRecordForm.vue';
import EditRecordForm from './RecordForms/EditRecordForm.vue'
import { storeToRefs } from 'pinia';
import { useRecordsStore, APIRecord } from '../stores/records/records';
import { useTagsStore } from '../stores/records/tags';

const tagsStore = useTagsStore();
const { tagsData } = storeToRefs(tagsStore)

const tagsFilterSelected = ref(null)

const recordsStore = useRecordsStore();
const { recordsData } = storeToRefs(recordsStore)

const loading = ref(false);
const nextPage = ref(2);
const pageSize = 6
let lastPage = Math.ceil(tagsData.value.length / pageSize)


onBeforeMount(async () => {
  await recordsStore.syncAllRecords()
  await tagsStore.syncData()

  lastPage = Math.ceil(tagsData.value.length / pageSize)
  console.log(lastPage);
})


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

  /*console.log(nextPage.value  + " " + lastPage);
  console.log(loading.value);
  console.log(to + " " + lastIndex );*/

  if (loading.value === false && nextPage.value < lastPage && to === lastIndex) {
        loading.value = true

    setTimeout(() => {
      nextPage.value++
      nextTick(() => {
        ref.refresh()
        loading.value = false
      })
    }, 1000)
  }
}

const onExecutionButtonClick = (recordId) => {
  recordsStore.executeRecord(recordId);
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
    field: (row: APIRecord) => row.tags.map(tagData => tagData),
    //format: (val, row) => val.sort().join(', '),
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
  {
    name: 'executeBtn',
    label: '',
    field: (row: APIRecord) => row.id,
    align: 'center',
    sortable: true,
  },
  {},
  {}
];

  //<q-btn round color="secondary" icon="double_arrow"></q-btn>
const selected = ref([])

</script>
