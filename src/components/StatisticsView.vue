<script setup lang="ts">

</script>

<template>

  <div class="h-full flex-1 flex flex-row flex-nowrap pt-14">
    <div class="bg-gray-950 w-3/4 p-2"></div>
    <div class="w-1/4 p-2 flex flex-col flex-nowrap">
      <input class="w-full p-2 border border-slate-400 bg-slate-700 rounded-md" placeholder="Search for a school...">
      <div class="flex-1 overflow-y-scroll overflow-x-hidden p-2">
        <div
          class="w-full p-2 my-2 bg-slate-700 rounded-md cursor-pointer hover:bg-slate-600"
          v-for="i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
          :key="i"
        >
          Schule {{ i }}
        </div>
      </div>
    </div>
  </div>
  <div class="absolute top-0 h-14 bg-slate-700 shadow w-full flex flex-row flex-nowrap items-center px-4">
    <span class="text-2xl text-sky-50">Lanis-School Monitor</span>
  </div>
</template>
