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

        <div class="col-12 col-md-auto text-h6 q-mb-sm">
          Periodicity
        </div>
        <div class="row">
          <div class="col-4">
            <InputField
              name="periodicity_min"
              label="minute"
              type="number"
              min="0"
              max="60"
              placeholder="60"
              no-error-icon="true"
              v-model="record.periodicity_min"
            ></InputField>
          </div>
          <div class="col-4 q-pl-md">
            <InputField
              name="periodicity_hour"
              label="hour"
              type="number"
              min="0"
              max="23"
              placeholder="14"
              no-error-icon="true"
              v-model="record.periodicity_hour"
            ></InputField>
          </div>
          <div class="col-4 q-pl-md">
            <InputField
              name="periodicity_day"
              label="Day"
              type="number"
              min="0"
              max="365"
              placeholder="2"
              no-error-icon="true"
              v-model="record.periodicity_day"
            ></InputField>
          </div>
        </div>
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
      url: yup.string().label('Url'), //required().url().
      label: yup.string().required().min(1).max(12).label('Label'),
      boundary: yup.string().max(64).label('Boundary'),
      periodicity_min: yup.number().required().min(0).max(60).label('Periodicity minutes'),
      periodicity_hour: yup.number().required().min(0).max(23).label('Periodicity hour'),
      periodicity_day: yup.number().required().min(0).max(365).label('Periodicity day')
}));

const tagsStore = useTagsStore();
const recordsStore = useRecordsStore();

tagsStore.cleanSelectedTags();

const insertHandler = () => {

  console.log(record.value);

  recordsStore.addNewRecord({...record.value, tags: tagsStore.tagsSelected});
  tagsStore.cleanSelectedTags();
  record.value = { ...emptyRecord }
}

const emptyRecord = {
  url: '',
  label: '',
  boundary: '',
  periodicity_min: 0,
  periodicity_hour: 0,
  periodicity_day: 0,
  periodicity: 0,
  active: false,
}

const record = ref<Omit<APIRecord, 'id'>>({
  ...emptyRecord
})

</script>