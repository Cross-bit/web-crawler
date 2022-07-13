<template>
  <div class="q-mx-md">
    <q-form>
      <q-input type="text" v-model="record.url" label="URL" />
      <q-input type="text" v-model="record.label" label="Label" />
      <q-input type="text" v-model="record.boundary" label="Regex boundary" />
      <q-input type="number" v-model="record.periodicity" label="Periodicity (seconds)" />
      <div class="row">
        <div class="col"><q-toggle v-model="record.active" label="Is active?" /></div>
        <div class="col q-px-md q-py-sm"><q-btn @click="updateHandler" color="primary" label="Update record" /></div>
        <div class="col q-py-sm"><q-btn @click="deleteHandler" color="negative" label="Delete record" /></div>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { useUpdateRecordMutation, Records } from '../graphql/_generated';
import { api } from '../boot/axios'

const props = defineProps<{
  record: Records
}>();

const record = ref(props.record)
const updateRecord = useUpdateRecordMutation()

const updateHandler = () => {
  updateRecord.executeMutation({...record.value})
}

const data = ref(null)

const deleteHandler = async () => {

  api.delete('/records/2').then((response) => {
    data.value = response.data
    console.log(data.value);
  })

}

</script>