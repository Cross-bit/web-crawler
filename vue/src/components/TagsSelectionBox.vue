  <template>
    <div>
    <b>Select tags:</b>
      <q-scroll-area
        class="rounded-borders q-pr-md"
        style="height: 200px; max-width: 300px;"
        bar-style="{ right: '4px', borderRadius: '5px', background: 'red', width: '10px', opacity: 1 }" >
        <q-option-group
          :options="tagsToRender"
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

const props = defineProps({
    tagsToRender: {
      type: []
    }
})
const tagsSelected = ref([]);

const emit  = defineEmits(['tagsSelected'])

const tagsSelectionHandler = (selected) => {
  tagsSelected.value = selected;
  emit('tagsSelected', selected)
}


</script>