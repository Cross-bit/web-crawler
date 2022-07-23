<template>
  <q-input
    v-model="value"
    :error-message="errorMessage"
    :error="!!errorMessage"
  />
</template>

<!-- Quasar input field with validation -->
<script setup lang="ts">
import { useField } from 'vee-validate';
import { ref } from 'vue';

const props = defineProps({
  name: {
    type: String,
        required: true,
    }
});

const { errorMessage, value } = useField<string>(ref(props.name));

</script>
