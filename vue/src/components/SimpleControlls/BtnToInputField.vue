<template>
    <div>
        <q-btn
                v-morph:AddTag:mygroup:100.tween="morphGroupModel"
                class="q-ma-sm"
                color="primary"
                size="md"
                label="Create tag"
                @click="nextMorph"
        ></q-btn>
        <q-form @submit="handleNewTag">
            <div
            v-morph:InputTag:mygroup:100.tween="morphGroupModel"
            class="row items-center">
                <div class="col-9">
                    <q-input :rules="validationRules" :autofocus="true" v-model="text" label="Enter new tag"  />
                </div>
                <div class="col-3">
                    <q-btn
                        color="primary"
                        :round="true"
                        size="md"
                        icon="add"
                        type="submit"
                        @click="nextMorph()"
                    ></q-btn>
                </div>
            </div>
        </q-form>
    </div>
</template>

<script setup lang="ts" >
import { ref } from 'vue';
import { useTagsStore } from '../../stores/records/tags';

const tagsStore = useTagsStore();
const text = ref('');

const handleNewTag = () => {
    tagsStore.addOne(text.value);
    text.value = '';
}

const validationRules = [
    val => (val.length <= 10 || 'Please use max 10 characters'),
    val => (val.indexOf(' ') < 0 || 'Whitespaces not allowed')
]



// Quasar morphing of two components (the tags create btn to the + and input field )

const nextMorphStep = {
    AddTag: 'InputTag',
    InputTag: 'AddTag',
}

const morphGroupModel = ref('AddTag')

const nextMorph = () => {
    morphGroupModel.value = nextMorphStep[ morphGroupModel.value ]
}
</script>