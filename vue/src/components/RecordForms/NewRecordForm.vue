<template>
<q-card class=" bg-grey-2 relative-position card-example">
  <q-card-section>
  <div class="row justify-center">
  <div class="col-12 col-md-auto text-h5 q-mb-md">
    Create new record
  </div>
  </div>
  <Form
  :validation-schema="schema"
  @submit="insertHandler"
  @reset="insertHandler">
    <div class="row q-mx-md justify-center" >
      <div class="col-lg-6 col-md-12 col-xs-5 q-mb-md">

        <InputField
          name="url"
          label="URL"
          placeholder="http://example.com"
          v-model="record.url"
        ></InputField>

        <InputField
          name="label"
          label="Label"
          placeholder="example"
          v-model="record.label"
        ></InputField>

        <InputField
          name="boundary"
          label="Boundary"
          placeholder="/boundary/"
          v-model="record.boundary"
        ></InputField>

        <InputField
          name="periodicity"
          label="Periodicity"
          placeholder="60"
          v-model="record.periodicity"
        ></InputField>

        <div class="row">
          <div class="col-6"><q-toggle v-model="record.active" label="Is active?" /></div>
          <div class="col-6 q-px-md q-pt-sm"><q-btn type="insertHandler" color="primary" label="Add record" /></div>
        </div>
      </div>

      <div class="col-lg-5 col-md-12 col-sm-6 col-xs-5 q-ml-lg">
        <TagSelectionBox ref="childComponentRef" ></TagSelectionBox> <!-- @tagsSelected="value=>selectedTags = value" -->
      </div>
    </div>
  </Form>
  </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TagSelectionBox from "./TagsSelectionBox.vue"
import { useRecordsStore, APIRecord } from '../../stores/records/records';
import { useTagsStore } from '../../stores/records/tags';
import InputField from '../Other/InputFieldVal.vue'
import { Form } from 'vee-validate';
import * as yup from "yup";
import * as message from '../../common/qusarNotify'

let schema = ref(yup.object({
      url: yup.string().required().url().label('Url'),
      label: yup.string().required().min(1).max(12).label('Label'),
      boundary: yup.string().max(64).label('Boundary'),
      periodicity: yup.number().required().min(0).max(256).label('Periodicity'),
}));

const tagsStore = useTagsStore();
const recordsStore = useRecordsStore();

tagsStore.cleanSelectedTags();

const insertHandler = () => {
  recordsStore.addNewRecord({...record.value, tags: tagsStore.tagsSelected});
  tagsStore.cleanSelectedTags();
  record.value = { ...emptyRecord }
}

const emptyRecord = {
  url: '',
  label: '',
  boundary: '',
  periodicity: 0,
  active: false,
}

const record = ref<Omit<APIRecord, 'id'>>({
  ...emptyRecord
})

</script>