<script setup lang="ts">
import { useDataStore } from '@/stores/data.ts'
import { ref } from 'vue'

const dataStore = useDataStore()
const search = ref('')


</script>

<template>
<input v-model="search" class="w-full p-2 border border-slate-400 bg-slate-700 rounded-md" placeholder="Search for a school...">
<div class="flex-1 overflow-y-scroll overflow-x-hidden p-2">
  <div
    class="w-full flex flex-row flex-nowrap p-2 my-2 bg-slate-700 rounded-md cursor-pointer hover:bg-slate-600"
    v-for="school in dataStore.schoolList"
    :key="school.Id"
  >
    <div class="flex-1 flex flex-col">
      <span>{{ school.Name }}</span>
      <small>{{ school.Ort }}</small>
    </div>
    <div class="">
      {{ school.Id }}
    </div>
  </div>
</div>
</template>
