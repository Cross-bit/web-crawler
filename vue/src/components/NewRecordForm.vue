<template>
  <div>
    <q-form>
      <q-input type="text" v-model="record.url" label="URL" />
      <q-input type="text" v-model="record.label" label="Label" />
      <q-input type="text" v-model="record.boundary" label="Regex boundary" />
      <q-input type="number" v-model="record.periodicity" label="Periodicity (seconds)" />
      <div class="row">
        <div class="col"><q-toggle v-model="record.active" label="Is active?" /></div>
        <div class="col q-px-md q-pt-sm"><q-btn @click="insertHandler" color="primary" label="Add record" /></div>
      </div>
    </q-form>
    <div class="" style="max-width: 350px">
    <b>Tags:</b>
    <q-option-group
      :options="tags"
      type="checkbox"
      v-model="selectedTags"
      :keep-color="true"
      :inline="true"
    ></q-option-group>
    {{selectedTags}}


      <btn-to-input-field></btn-to-input-field>
    </div>
  </div>
</template>

<script setup lang="ts">
import BtnToInputField from './SimpleControlls/BtnToInputField.vue'
import { QOptionGroup } from 'quasar';
import { ref } from 'vue';
import { useInsertRecordMutation, Records } from '../graphql/_generated';

const insertRecord = useInsertRecordMutation()

const text = ref()

const selectedTags = ref([]);
const tags =  [
    { label: 'first', value: 'first', },
    { label: 'sec', value: 'sec', color: 'green' },
    { label: 'third', value: 'third', color: 'red' },
    { label: 'first', value: 'first', },
    { label: 'sec', value: 'sec', color: 'green' },
    { label: 'third', value: 'third', color: 'red' },
    { label: 'first', value: 'first', },
    { label: 'sec', value: 'sec', color: 'green' },
    { label: 'third', value: 'third', color: 'red' }
]


const insertHandler = () => {

  insertRecord.executeMutation({
    ...record.value
  })

  record.value = {...emptyRecord}
}

const emptyRecord = {
  url: '',
  label: '',
  boundary: '',
  periodicity: 0,
  active: false,
}

const record = ref<Omit<Records, 'id'>>({
  ...emptyRecord
})

</script>