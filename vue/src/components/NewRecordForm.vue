<script setup lang="ts">
import { ref } from 'vue';
import { useInsertRecordMutation, Record } from '../graphql/_generated';

const insertRecord = useInsertRecordMutation()
const insertHandler = () => {
  insertRecord.executeMutation({
    ...record.value
  })
  // TODO: handle error (show toast)
  record.value = {...emptyRecord}
}

const emptyRecord = {
  url: '',
  label: '',
  boundary: '',
  periodicity: 0,
  active: false,
}

const record = ref<Omit<Record, 'id'>>({
  ...emptyRecord
})

</script>

<template>
  <q-form>
    <q-input type="text" v-model="record.url" label="URL" />
    <q-input type="text" v-model="record.label" label="Label" />
    <q-input type="text" v-model="record.boundary" label="Regex boundary" />
    <q-input type="number" v-model="record.periodicity" label="Periodicity (seconds)" />
    <q-toggle v-model="record.active" label="Is active?" />
    <q-btn @click="insertHandler" color="primary" label="Add record" />
  </q-form>
</template>