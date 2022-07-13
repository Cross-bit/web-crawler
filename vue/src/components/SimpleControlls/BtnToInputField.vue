<template>
    <div class="row items-center">
        <div class="col-7">
            <q-input :autofocus="true" v-model="text" label="Enter new tag"  />
        </div>
        <div class="col-5">
            <q-btn v-if="text.trim()"
                class="q-ma-sm"
                color="primary"
                size="md"
                icon="add"
                label="Add tag"
                @click="handleAddNewTag"
            ></q-btn>
        </div>
    </div>
</template>

<script setup lang="ts" >
import { ref } from 'vue';

const text = ref();

const handleAddNewTag = () => {
    text.value = "";
    // todo:
}

</script>