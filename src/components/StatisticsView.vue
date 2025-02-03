<script setup lang="ts">
import { useDataStore } from '@/stores/data.ts'
import MainSchoolsComparedLineChart from '@/components/charts/MainSchoolsComparedLineChart.vue'
import SchoolSearcher from '@/components/SchoolSearcher.vue'

const dataStore = useDataStore()
dataStore.fetchData()
</script>

<template>

  <div class="h-full flex-1 flex flex-row flex-nowrap pt-14">
    <div class="bg-gray-950 w-3/4 p-2">
      <MainSchoolsComparedLineChart :data="dataStore.data ?? {}" />
    </div>
    <div class="w-1/4 p-2 flex flex-col flex-nowrap h-full">
      <SchoolSearcher class="h-full" />
    </div>
  </div>
  <div class="absolute top-0 h-14 bg-slate-700 shadow w-full flex flex-row flex-nowrap items-center px-4">
    <span class="text-2xl text-sky-50">Lanis-School Monitor</span>
    <div class="flex-1"></div>
    <div class="bg-gray-900 text-white p-4 select-none hover:cursor-pointer hover:scale-105" @click="dataStore.fetchData">Refresh</div>
  </div>
</template>
