<template>
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
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useInsertRecordMutation, Records } from '../graphql/_generated';

const insertRecord = useInsertRecordMutation()

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