<template>
    <q-badge :color="active ? 'green' : 'red'" >{{ active.toString().toUpperCase() }}</q-badge>
</template>

<script setup lang="ts">
import {defineProps} from 'vue';

const props = defineProps(['active']);


</script>