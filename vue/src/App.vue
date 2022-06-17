<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { createClient, provideClient } from '@urql/vue';

const client = createClient({
  url: 'http://localhost:8080/v1/graphql',
  maskTypename: true,
});

export default defineComponent({
  name: 'App',
  setup() {
    provideClient(client);
  },
});
</script>
