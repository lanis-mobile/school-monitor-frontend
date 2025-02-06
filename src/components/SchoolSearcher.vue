<script setup lang="ts">
import { useDataStore } from '@/stores/data.ts'
import { computed, ref } from 'vue'
import SchoolSearcherListTile from '@/components/SchoolSearcherListTile.vue'

const dataStore = useDataStore()
const search = ref('')


//remove all special characters and make lowercase + remove spaces
function normalize(s: string): string {
  return s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().replace(/\s/g, '')
}

const searchResult = computed(() => {
  if (!search.value) return dataStore.activeSchoolList
  const normalizedSearch = normalize(search.value)
  return dataStore.activeSchoolList.filter(school => {
    return normalize(school.Name).includes(normalizedSearch) || normalize(school.Ort).includes(normalizedSearch) || normalize(school.Id).includes(normalizedSearch)
  })
})


</script>

<template>
<input v-model="search" class="w-full p-2 border border-slate-400 bg-slate-700 rounded-md" placeholder="Search for a school...">
<div class="flex-1 overflow-y-scroll overflow-x-hidden p-2">
  <SchoolSearcherListTile
    v-for="school in searchResult"
    :key="school.Id"
    :school="school"
  />
</div>
</template>

<style scoped>
/* Style the scrollbar */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}
</style>
