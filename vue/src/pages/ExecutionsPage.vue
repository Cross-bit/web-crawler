<template>
<ExecutionsTable/>
</template>

<script lang="ts">
import ExecutionsTable from 'components/ExecutionsTable.vue'
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
name: "ExecutionsPage",
components: { ExecutionsTable },
})

</script>