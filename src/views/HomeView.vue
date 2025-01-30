<script setup lang="ts">
import LoginView from "@/components/LoginView.vue";
import {useSessionStore} from "@/stores/session.ts";
import StatisticsView from '@/components/StatisticsView.vue'

const sessionStore = useSessionStore()

</script>

<template>
  <main>
    <div class="h-screen" v-if="!sessionStore.authenticated">
      <LoginView />
    </div>
    <div class="h-screen text-amber-50" v-else>
      <StatisticsView />
    </div>
  </main>
</template>
