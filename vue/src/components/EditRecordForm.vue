<template>
<q-card class=" bg-grey-2 relative-position card-example">
  <q-card-section>
  <div class="row justify-center">
  <div class="col-12 col-md-auto text-h5 q-mb-md">
    Create new record
  </div>
  </div>
    <q-form>
      <div class="row q-mx-md justify-center" >
        <div class="col-lg-6 col-md-12 q-mb-md">
          <q-input type="text" v-model="record.url" label="URL" />
          <q-input type="text" v-model="record.label" label="Label" />
          <q-input type="text" v-model="record.boundary" label="Regex boundary" />
          <q-input type="number" v-model="record.periodicity" label="Periodicity (seconds)" />
          <div class="row">
            <div class="col"><q-toggle v-model="record.active" label="Is active?" /></div>
            <div class="col q-px-md q-py-sm"><q-btn @click="updateHandler" color="primary" label="Update record" /></div>
            <div class="col q-py-sm"><q-btn @click="deleteHandler" color="negative" label="Delete record" /></div>
          </div>
      </div>

      <div class="col-lg-5 col-md-12 col-sm-5 col-xs-5 q-ml-lg">
        <TagSelectionBox @tagsSelected="value=>selectedTags = value" ref="childComponentRef" ></TagSelectionBox>
      </div>

    </div>
    </q-form>
    </q-card-section>
    </q-card>
  <!-- </div> -->
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { useUpdateRecordMutation, Records } from '../graphql/_generated';
import { api } from '../boot/axios'

import TagSelectionBox from "./TagsSelectionBox.vue"
const selectedTags = ref([4, 5]);

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