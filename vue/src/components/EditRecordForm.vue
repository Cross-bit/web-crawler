<template>
  <q-form>
    <q-input type="text" v-model="record.url" label="URL" />
    <q-input type="text" v-model="record.label" label="Label" />
    <q-input type="text" v-model="record.boundary" label="Regex boundary" />
    <q-input type="number" v-model="record.periodicity" label="Periodicity (seconds)" />
    <q-toggle v-model="record.active" label="Is active?" />
    <q-btn @click="updateHandler" color="primary" label="Update record" />
    <q-btn @click="deleteHandler" color="negative" label="Delete record" />
  </q-form>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { useUpdateRecordMutation, Records } from '../graphql/_generated';
import { api } from '../boot/axios'
//import axios from 'axios'

const props = defineProps<{
  record: Records
}>();

const record = ref(props.record)

const updateRecord = useUpdateRecordMutation()

const updateHandler = () => {
  updateRecord.executeMutation({...record.value})
}

// const data = ref(null)

const deleteHandler = async () => {

/*  fetch('http://localhost:5000/api/v1/records/1', {
            method: "get",
            headers: { "Content-Type": "application/json" }
 }).then((val)=> {
  return val.json();
  console.log(val.body)}).catch((err) =>{

  console.log(err);
 }).then((data)=> {console.log(data)})*/
const data = ref(null)
api.get('/records/1').then((response) => {
        data.value = response.data
        console.log(data.value);
      })

  }

</script>