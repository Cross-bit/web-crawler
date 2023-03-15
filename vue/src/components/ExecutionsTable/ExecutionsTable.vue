<template>
    <div v-if="executionsData" >
    <div class="row items-center">
        <div class="col-8"><h5 class="q-my-sm" >Executions:</h5></div>
        <div class="col-4">
        <q-select
            dense
            options-dense
            filled
            v-model="executionsByLabelFilter"
            label="Filter by record label"
            multiple
            :options="allRecordsLabels"
            :loading="filterLoading"
            @virtual-scroll="onFilterScroll"
            outlined
        >
        <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
        <q-item v-bind="itemProps">
        <q-item-section>
            <q-item-label v-html="opt.label"></q-item-label>
        </q-item-section>
        <q-item-section side>
            <q-toggle :model-value="selected" @update:model-value="toggleOption(opt)"></q-toggle>
        </q-item-section>
        </q-item>
    </template>
        </q-select>
        </div>
    </div>
    <q-table
        selection="single"
        :rows="recordsData"
        :columns="columns"
        row-key="id"
        :rowsPerPageOptions="[5, 7, 10]"
    />
    </div>
    <div v-else>
    <q-spinner color="primary" size="3em" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const executionsData = [];
const executionsByLabelFilter = ref('')
const allRecordsLabels = ref(['dumb'])
const filterLoading = ref(false)

const onFilterScroll = ({ to, ref }) => {
    // todo
}

const selectedExecutions = "selected"



</script>
