<script setup lang="ts">

import { type Ref, ref } from 'vue'
import { useDataStore } from '@/stores/data.ts'

const dataStore = useDataStore()


const {school} = defineProps<{
  school: {
    Id: string
    Name: string
    Ort: string
  }
}>()

const openSchool = (id: string) => {
  window.open(`https://start.schulportal.hessen.de/${id}`)
}

const schoolCount: Ref<number | null> = ref(null);

const loadSchoolCount = () => {
  schoolCount.value = dataStore.getSchoolLoginCount(school.Id)
}

</script>

<template>
  <div
    class="w-full flex flex-row flex-nowrap my-2 bg-slate-700 rounded-md hover:bg-slate-600"
    :key="school.Id"
    @mouseenter="loadSchoolCount"
  >
    <div class="flex-1 flex flex-col p-1">
      <span>{{ school.Name }}</span>
      <small>{{ school.Ort }}</small>
    </div>
    <div class="flex flex-col">
      <div class="bg-yellow-100 rounded-tr-md rounded-bl-md px-1 cursor-pointer text-black" @click="openSchool(school.Id)">
        {{ school.Id }}
      </div>
      <div :title="` registered in the past 3 Months`">
        {{ schoolCount }}
      </div>
    </div>

  </div>
</template>
