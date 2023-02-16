<template>
    <q-page class="row items-center justify-evenly">
        <div class="col-lg-10 col-md-12 col-xs-12" ><records-table></records-table>
            <ExecutionsTable/>
        </div>
    </q-page>
</template>

<script lang="ts">
import ExecutionsTable from '../components/ExecutionsTable/ExecutionsTable.vue'
import { defineComponent } from 'vue';

export default defineComponent({
    name: "ExecutionsPage",
    components: { ExecutionsTable },
})

</script>