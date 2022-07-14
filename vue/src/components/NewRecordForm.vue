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
    <div class="col-lg-6 col-md-12">

          <q-input type="text" v-model="record.url" label="URL" />
          <q-input type="text" v-model="record.label" label="Label" />
          <q-input type="text" v-model="record.boundary" label="Regex boundary" />
          <q-input type="number" v-model="record.periodicity" label="Periodicity (seconds)" />
          <div class="row">
            <div class="col-6"><q-toggle v-model="record.active" label="Is active?" /></div>
            <div class="col-5 q-px-md q-pt-sm"><q-btn @click="insertHandler" color="primary" label="Add record" /></div>
          </div>

    </div>
    <div class="bg-grey-3 col-lg-5 col-md-12 col-sm-6 col-xs-12 q-pa-sm q-ml-lg">
    <tags-selection-box :tags-to-render="tags" @tagsSelected="value=>selectedTags = value" ></tags-selection-box>
    {{selectedTags}}
    </div>
  </div>
  </q-form>
  </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import BtnToInputField from './SimpleControlls/BtnToInputField.vue'
import { QOptionGroup } from 'quasar';
import { Ref, ref } from 'vue';
import { Tags_Records_Relations_Insert_Input, useInsertTagsRecordRelationsMutation, useInsertRecordMutation, Records, Tags } from '../graphql/_generated';
import { useAllTagsQuery, AllTagsQuery, } from "../graphql/_generated"
import TagsSelectionBox from "./TagsSelectionBox.vue"
import { response } from 'express';


const insertRecord = useInsertRecordMutation()
const insertTagsRecordsRelations = useInsertTagsRecordRelationsMutation();

const selectedTags = ref([4, 5]);

const tags: Ref<any[]> = ref([]);

// fetch tags
useAllTagsQuery().then((tagsData) => {
tagsData?.data?.value?.tags.forEach(tagData => {
    tags.value.push({label: tagData.tag_name, value: tagData.id})
  });
});

const tagSelection = (val) => {
  selectedTags.value=val;
}


const insertHandler = () => {

  const tagsTmp = [...selectedTags.value]
  selectedTags.value = [];

  insertRecord.executeMutation({
    ...record.value
  }).then(response =>
  {

    const tagsRelations: Tags_Records_Relations_Insert_Input[] = tagsTmp.reduce((previous, current)=> {
      previous.push({
        record_id: response.data.insert_records_one.id,
        tag_id: current
      });
    return previous;
    }, []);

    insertTagsRecordsRelations.executeMutation({
        objects: tagsRelations
      }
    );
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

<style lang="sass">

.myCard
  color: #FFFFFF


</style>