<template>
  <q-form>
    <q-input type="text" v-model="record.url" label="URL" />
    <q-input type="text" v-model="record.label" label="Label" />
    <q-input type="text" v-model="record.boundary" label="Regex boundary" />
    <q-input type="number" v-model="record.periodicity" label="Periodicity (seconds)" />
    <q-toggle v-model="record.active" label="Is active?" />
    <q-btn @click="updateHandler" color="primary" label="Update record" />
  </q-form>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { useUpdateRecordMutation, Record } from '../graphql/_generated';

const props = defineProps<{
  record: Record
}>();

const record = ref(props.record)

const updateRecord = useUpdateRecordMutation()

const updateHandler = () => {
  updateRecord.executeMutation({...record.value})
}

</script>