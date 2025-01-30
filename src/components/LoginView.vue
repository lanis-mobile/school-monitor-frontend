<script setup lang="ts">
import {ref} from "vue";
import {useSessionStore} from "@/stores/session.ts";

const sessionStore = useSessionStore()

const username = ref('')
const totp = ref('')

const loading = ref(false)

async function handleLogin() {
  loading.value = true
  await sessionStore.authenticate(username.value, totp.value)
  loading.value = false
}

</script>

<template>
  <main>
    <div class="h-screen flex container mx-auto justify-center items-center">
      <div class="bg-slate-200 rounded-md p-5">
        <form @submit.prevent="handleLogin">
          <div class="flex flex-col flex-nowrap justify-center items-center p-2">
            <span class="text-2xl">Login</span>
            <input type="text" v-model="username" placeholder="Username" class="w-50 mt-5 p-2 border border-slate-400 rounded-md" />
            <input type="password" v-model="totp" placeholder="TOTP" class="w-50 mt-5 p-2 border border-slate-400 rounded-md" />
            <button type="submit" class="w-50 mt-5 p-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 hover:cursor-pointer">Login</button>
          </div>
        </form>
      </div>
    </div>
    <!-- overlay -->
    <div v-if="loading" class="fixed inset-0 h-screen w-screen bg-black opacity-50 z-50">
      <div class="flex justify-center items-center h-full">
        <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-l-2 border-r-2 border-slate-600"></div>
      </div>
    </div>
  </main>
</template>
