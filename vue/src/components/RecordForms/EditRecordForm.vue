<template>
<q-card class=" bg-grey-2 relative-position card-example">
  <q-card-section>
  <div class="row justify-center">
  <div class="col-12 col-md-auto text-h5 q-mb-md">
    Edit record
  </div>
  </div>
    <Form
      :validation-schema="schema"
      :initial-values="initialValues"
      @invalid-submit="invalidSubmitionHandler"
      @submit="submitionHandler"
    >
      <div class="row q-mx-md justify-center" >
        <div class="col-lg-6 col-md-12 q-mb-md">

        <Field name="url" v-slot="{ errorMessage, value, field }">
          <q-input
            label="url"
            placeholder="user@example.com"
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            @update:model-value="record.url = $event"
          />
        </Field>

        <Field name="label" v-slot="{ errorMessage, value, field }">
            <q-input
              label="label"
              placeholder="example"
              :model-value="value"
              v-bind="field"
              :error-message="errorMessage"
              :error="!!errorMessage"
              @update:model-value="record.label = $event"
            />
        </Field>

        <Field name="boundary" v-slot="{ errorMessage, value, field }">
            <q-input
              label="boundary"
              placeholder="/boundary/"
              :model-value="value"
              v-bind="field"
              :error-message="errorMessage"
              :error="!!errorMessage"
              @update:model-value="record.boundary = $event"
            />
        </Field>

        <Field name="periodicity" v-slot="{ errorMessage, value, field }">
            <q-input
              label="periodicity"
              placeholder="0"
              :model-value="value"
              v-bind="field"
              :error-message="errorMessage"
              :error="!!errorMessage"
              @update:model-value="record.periodicity = $event"
            />
        </Field>

        <div class="col-12 col-md-auto text-h6 q-mb-sm">
          Periodicity
        </div>
        <div class="row">
          <div class="col-4">
            <Field name="periodicity_min" v-slot="{ errorMessage, value, field }">
              <q-input
                label="minute"
                placeholder="0"
                no-error-icon="true"
                type="number"
                :model-value="value"
                v-bind="field"
                :error-message="errorMessage"
                :error="!!errorMessage"
                @update:model-value="record.periodicity_min = $event"
              />
            </Field>
          </div>
          <div class="col-4 q-pl-md">
            <Field name="periodicity_hour" v-slot="{ errorMessage, value, field }">
              <q-input
                label="hour"
                placeholder="0"
                no-error-icon="true"
                type="number"
                :model-value="value"
                v-bind="field"
                :error-message="errorMessage"
                :error="!!errorMessage"
                @update:model-value="record.periodicity_hour = $event"
              />
            </Field>
          </div>
          <div class="col-4 q-pl-md">
            <Field name="periodicity_day" v-slot="{ errorMessage, value, field }">
              <q-input
                label="day"
                placeholder="0"
                no-error-icon="true"
                type="number"
                :model-value="value"
                v-bind="field"
                :error-message="errorMessage"
                :error="!!errorMessage"
                @update:model-value="record.periodicity_day = $event"
              />
            </Field>
          </div>
        </div>


          <div class="row">
            <div class="col"><q-toggle v-model="record.active" label="Is active?" /></div>
            <div class="col q-px-md q-py-sm"><q-btn type="submit" color="primary" label="Update record" /></div>
            <div class="col q-py-sm"><q-btn @click="deleteHandler" color="negative" label="Delete record" /></div>
          </div>
      </div>

      <div class="col-lg-5 col-md-12 col-sm-5 col-xs-5 q-ml-lg">
        <TagSelectionBox :key="record.id" ></TagSelectionBox>
      </div>
    </div>
    </Form>
    </q-card-section>
    </q-card>
  <!-- </div> -->
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import TagSelectionBox from './TagsSelectionBox.vue'
import { useRecordsStore, APIRecord } from '../../stores/records/records';
import { useTagsStore } from '../../stores/records/tags';
import { Field, Form } from 'vee-validate';
import * as yup from 'yup';
import * as message from '../../common/qusarNotify'

const tagsStore = useTagsStore();
const props = defineProps<{
  record
}>();

// emits:
const emit = defineEmits(['onDelete'])

// commands:
const record = ref(props.record)
const recordsStore = useRecordsStore();
tagsStore.setSelectedTags(record.value.tags.map((tag_val) => tag_val.id));

// validion:
let schema = ref(yup.object({
      url: yup.string().label('Url'), //required().url()
      label: yup.string().required().min(1).max(12).label('Label'),
      boundary: yup.string().max(64).label('Boundary'),
      periodicity_min: yup.number().required().min(0).max(60).label('Periodicity minutes'),
      periodicity_hour: yup.number().required().min(0).max(23).label('Periodicity hour'),
      periodicity_day: yup.number().required().min(0).max(365).label('Periodicity day')
}));

const initialValues = {
  url: record.value.url,
  label: record.value.label,
  boundary: record.value.boundary,
  periodicity_min: record.value.periodicity_min || 0,
  periodicity_hour: record.value.periodicity_hour || 0,
  periodicity_day: record.value.periodicity_day || 0,
};

const invalidSubmitionHandler = (errors) => {
  message.warning('Check form for errors!');
}

const submitionHandler = async () => {
    recordsStore.updateRecords(record.value.id, {
        label: record.value.label,
        url: record.value.url,
        boundary: record.value.boundary,
        periodicity_min: record.value.periodicity_min,
        periodicity_hour: record.value.periodicity_hour,
        periodicity_day: record.value.periodicity_day,
        active: record.value.active,
        tags: tagsStore.tagsSelected
      });
}

const deleteHandler = async () => {
  recordsStore.deleteRecord(record.value.id).then((response) => {
    record.value = emptyRecord;
    tagsStore.cleanSelectedTags();
    emit('onDelete')
  })
}

const emptyRecord: APIRecord = {
  url: '',
  label: '',
  boundary: '',
  periodicity_min: 0,
  periodicity_hour: 0,
  periodicity_day: 0,
  active: false,
}

</script>