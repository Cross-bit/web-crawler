<template>
    <div class="row items-center">
        <div class="col-7">
            <q-input :rules="validationRules" :autofocus="true" v-model="text" label="Enter new tag"  />
        </div>
        <div class="col-5">
            <q-btn
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
import { useInsertTagMutation } from "../../graphql/_generated"

const text = ref();
const createTag = useInsertTagMutation();

const validationCheck = ref();

const validationRules = [
        val => validationCheck.value = val.length <= 10 || 'Please use maximum 10 characters',
        val => validationCheck.value = val.indexOf(' ') < 0 || 'Whitespaces not allowed'
    ]


const handleAddNewTag = () => {

validationCheck.value === true && createTag.executeMutation({
        tag_name: text.value
    }
    ).then((res) => {
        text.value = ""; // todo:přidat něco smysluplného na succes a failure
    }).catch(() => {
        text.value = "";
    });
}

</script>