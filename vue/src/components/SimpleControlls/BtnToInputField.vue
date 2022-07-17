<template>
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
</template>

<script setup lang="ts" >
import { ref } from 'vue';
import { useInsertTagMutation } from '../../graphql/_generated'

import { useTagsStore } from '../../stores/records/tags';

const text = ref('');

const tagsStore = useTagsStore();

const handleNewTag = () => {
    tagsStore.addOne(text.value);
    text.value = '';
}

const createTag = useInsertTagMutation();
const validationCheck = ref();

const validationRules = [
    val => (val.length <= 100 || 'Please use maximum 10 characters'),
    val => (val.indexOf(' ') < 0 || 'Whitespaces not allowed')
]

const handleAddNewTag = () => {

createTag.executeMutation({
        tag_name: text.value
    }
    ).then((res) => {
        text.value = ""; // todo: přidat něco smysluplného na succes a failure
    }).catch(() => {
        text.value = "";
    });
}


const nextMorphStep = {
    AddTag: 'InputTag',
    InputTag: 'AddTag',
}

const morphGroupModel = ref('AddTag')

const nextMorph = () => {
    morphGroupModel.value = nextMorphStep[ morphGroupModel.value ]
}
</script>