<script setup lang="ts">
import { useDataStore } from '@/stores/data.ts'
import MainSchoolsComparedLineChart from '@/components/charts/MainSchoolsComparedLineChart.vue'
import SchoolSearcher from '@/components/SchoolSearcher.vue'
import { useSessionStore } from '@/stores/session.ts'
import MainSchoolsComparedBarChart from '@/components/charts/MainSchoolsComparedBarChart.vue'
import { type Component, ref, watch } from 'vue'
import MainSchoolsByCityMap from '@/components/charts/MainSchoolsByCityMap.vue'

const dataStore = useDataStore()
const sessionStore = useSessionStore()
dataStore.fetchData()

const charts: Record<string, Component> = {
  lineSchoolDetail: MainSchoolsComparedLineChart,
  barTotal: MainSchoolsComparedBarChart,
  cityMap: MainSchoolsByCityMap,
}

const selectedChart = ref('lineSchoolDetail')

const autoRefresh = ref(false)

let interval: number | null = null;

watch(autoRefresh, (value) => {
  if (value) {
    interval = setInterval(() => {
      dataStore.fetchData()
    }, 60000)
  } else {
    clearInterval(interval!)
  }
})

function downloadFile(filename: string, data: string) {
  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data))
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}

const downloadCSV = () => downloadFile('data.csv', dataStore.dataToCsv())

</script>

<template>

  <div class="h-full flex-1 flex flex-row flex-nowrap pt-14">
    <div class="bg-gray-950 w-3/4 p-2">
      <component :is="charts[selectedChart]" :data="dataStore.data ?? {data: {}, uniqueDaysInOrder: []}" />
    </div>
    <div class="w-1/4 p-2 flex flex-col flex-nowrap h-full">
      <SchoolSearcher class="h-full" />
    </div>
  </div>
  <div class="absolute top-0 h-14 bg-slate-700 shadow w-full flex flex-row flex-nowrap items-center px-4">
    <span class="text-2xl text-sky-50">Lanis-School Monitor</span>
    <span class="flex-1 px-2 border-l-2 border-l-white ml-2">
    Total Logins: {{ dataStore.combinedLoginCount }}
  </span>

    <select v-model="selectedChart" class="bg-gray-900 text-white p-2 mx-2">
      <option
        v-for="(chart, key) in charts"
        :key="key"
        :value="key"
        class="bg-gray-900 text-white p-2"
      >
        {{ key }}
      </option>
    </select>
    <div class="bg-gray-900 text-white p-4 select-none hover:cursor-pointer hover:scale-105" @click="downloadCSV">Download CSV</div>
    <div v-if="sessionStore.user?.admin" class="bg-red-500 text-white p-4 mx-2 select-none hover:cursor-pointer hover:scale-105">Access Management</div>
    <div class="bg-gray-900 text-white p-4 select-none hover:cursor-pointer hover:scale-105" @click="dataStore.fetchData">
      Refresh
      <input v-model="autoRefresh" type="checkbox" class="mx-2" title="Enable/Disable auto-refresh" />
    </div>
  </div>
</template>
