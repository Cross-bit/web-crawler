  <template>
    <div v-if="tagsStore.getTags" class="bg-grey-3 shadow-2 tagsBox q-py-sm q-pl-sm">
      <div class="text-h6">Select tags:</div>
          <span :key="tagsSelected.length" v-if="tagsSelected.length == tagsStore.getMaxOfSelectedTags" style="color:grey">
          Max number of tags is {{ tagsStore.getMaxOfSelectedTags }}</span>
          <q-scroll-area
            :key="tagsSelected.length"
            class="rounded-borders q-pr-md"
            style="height: 200px;"
            bar-style="{ right: '4px', borderRadius: '5px', background: 'red', width: '10px', opacity: 0.7 }"
            >
            <q-option-group
              :options="tagsStore.getTags"
              type="checkbox"
              v-model="tagsSelected"
              :keep-color="true"
              :inline="true"
            >

            <template v-slot:label="opt">
              <div class="row items-center">
                <q-badge :color="opt.color">{{ opt.label }}</q-badge>
              </div>
          </template>

            </q-option-group>
          </q-scroll-area>
        <btn-to-input-field></btn-to-input-field>
    </div>
    <div v-else class="row full-height justify-center">
      <q-spinner class="q-my-auto " color="primary" size="3em" />
    </div>

</template>

<script setup lang="ts">
import BtnToInputField from '../SimpleControlls/BtnToInputField.vue'
import { useTagsStore } from '../../stores/records/tags';
import { storeToRefs } from 'pinia';

const tagsStore = useTagsStore();
const { tagsSelected } = storeToRefs(tagsStore);

tagsStore.syncData();

</script>

<style lang="sass">
.tagsBox
  border-radius: 5px

</style>

