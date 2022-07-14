<template>
<q-card class=" bg-grey-2 relative-position card-example">
  <q-card-section>
  <div class="row justify-center">
  <div class="col-12 col-md-auto text-h5 q-mb-md">
    Create new record
  </div>
  </div>

  <div class="row q-mx-md justify-center" >
    <div class="col-lg-6 col-md-12">
      <q-form>
        <q-input type="text" v-model="record.url" label="URL" />
        <q-input type="text" v-model="record.label" label="Label" />
        <q-input type="text" v-model="record.boundary" label="Regex boundary" />
        <q-input type="number" v-model="record.periodicity" label="Periodicity (seconds)" />
        <div class="row">
          <div class="col-6"><q-toggle v-model="record.active" label="Is active?" /></div>
          <div class="col-5 q-px-md q-pt-sm"><q-btn @click="insertHandler" color="primary" label="Add record" /></div>
        </div>
      </q-form>
    </div>
    <div class="bg-grey-3 col-lg-5 col-md-12 col-sm-6 col-xs-12 q-pa-sm q-ml-lg">
      <b>Select tags:</b>
      <q-scroll-area
        class="rounded-borders q-pr-md"
        style="height: 200px; max-width: 300px;"
        bar-style="{ right: '4px', borderRadius: '5px', background: 'red', width: '10px', opacity: 1 }" >
        <q-option-group
          :options="tags"
          type="checkbox"
          v-model="selectedTags"
          :keep-color="true"
          :inline="true"
        ></q-option-group>
      </q-scroll-area>
      <btn-to-input-field></btn-to-input-field>
    </div>
  </div>
  </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import BtnToInputField from './SimpleControlls/BtnToInputField.vue'
import { QOptionGroup } from 'quasar';
import { Ref, ref } from 'vue';
import { useInsertRecordMutation, Records, Tags } from '../graphql/_generated';
import { useAllTagsQuery, AllTagsQuery, } from "../graphql/_generated"

const insertRecord = useInsertRecordMutation()

const text = ref()

const selectedTags = ref([]);

const tags = ref([]);

useAllTagsQuery().then((tagsData) => {
tagsData?.data?.value?.tags.forEach(tagData => {
    tags.value.push({label: tagData.tag_name, value: tagData.id})
  });
});


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

<style lang="sass">

.myCard
  color: #FFFFFF


</style>