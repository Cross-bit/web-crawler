<template>
    <div v-if="true" >
          <div class="q-pa-md items-start q-gutter-md">
    <q-card 
     
    v-for="(record) in recordsData" :key="record.id"
    class="my-card" style="" 
    @click="() => onCardClick(record.id)" >
    
      <q-card-section 
      class="
      text-white"
      :class="{ 'bg-primary': recordId == record.id,
                'bg-grey-8':  recordId != record.id }" 
      >
      <div class="text-h6">{{ record.label }}</div>
      <div class="text-subtitle2">{{ record.url }}</div>
      </q-card-section>
    
      <q-separator></q-separator>
      <span>Is active <q-icon 
      :color="record.active ? 'green' : 'red'"
      name="circle"> </q-icon>
      </span>
      

      <q-card-actions align="right">
        <q-btn flat>Execute record</q-btn>
      </q-card-actions>
    </q-card>
  </div>
    </div>
    <div v-else>
    <q-spinner color="primary" size="3em" />
    </div>
</template>

<script setup lang="ts">

import { onBeforeMount, defineEmits } from 'vue'
import { useRecordsStore } from '../../stores/records/records';
import { useGraphsDataStore } from '../../stores/graphData';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import * as message from "../../common/qusarNotify"


const recordsStore = useRecordsStore()
const { recordsData } = storeToRefs(recordsStore)

const graphDataStore = useGraphsDataStore()
let { currentGraphRecordId: recordId } = storeToRefs(graphDataStore)

const router = useRouter();
const route = useRoute();

recordId.value = +(route.params.id);

const emit = defineEmits<{
  (e: 'close', id: number): void
}>()

// select another record
const onCardClick = (idClicked) => {
    const currentRoute = route.path;
    const routeBase = currentRoute.slice(0, currentRoute.lastIndexOf('/'));
    router.push({path: `${routeBase}/${idClicked}`, query: {}, params: {}});
    recordId.value = idClicked;
    emit('close', idClicked)
}

onBeforeMount(() => {
    try {
        recordsStore.syncAllRecords()    
    }
    catch(error) {
        message.error("Records couldn't be synchronized, due to internal server error.");
        console.error(error);
    }
})

</script>
