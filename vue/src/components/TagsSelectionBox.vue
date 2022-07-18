  <template>
    <div class="bg-grey-3 shadow-2 tagsBox q-py-sm q-pl-sm">
    <div class="text-h6">Select tags:</div>
      <q-scroll-area
        class="rounded-borders q-pr-md"
        style="height: 200px;"
        bar-style="{ right: '4px', borderRadius: '5px', background: 'red', width: '10px', opacity: 0.7 }" >
        <q-option-group
          :options="tagsData"
          type="checkbox"
          :model-value="tagsSelected"
          @update:model-value="tagsSelectionHandler($event)"
          :keep-color="true"
          :inline="true"
        ></q-option-group>
      </q-scroll-area>
      <btn-to-input-field></btn-to-input-field>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useFormChild } from 'quasar'
import BtnToInputField from './SimpleControlls/BtnToInputField.vue'
import { useTagsStore } from '../stores/records/tags';

import { storeToRefs } from 'pinia';

const tagsStore = useTagsStore();

const { tagsData } = storeToRefs(tagsStore);

tagsStore.syncData();

const tagsSelected = ref([]);
const cleanSelectionHook = function(): boolean {
  tagsSelected.value = []
  return true;
}
//#region

//#endregion
// quasars way of communication with child form on send
useFormChild({
  validate: cleanSelectionHook,
  requiresQForm: true
})

const emit = defineEmits(['tagsSelected'])

const tagsSelectionHandler = (selected) => { // inform parent on
  tagsSelected.value = selected;
  emit('tagsSelected', selected)
}
</script>


<style lang="sass">
.tagsBox
  border-radius: 5px

</style>

