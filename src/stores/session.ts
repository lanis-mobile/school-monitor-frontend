import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type {IUser} from "@/interfaces/IUser.ts";

const API_URL = 'http://localhost:3000'


export const useSessionStore = defineStore('session',
  () => {
    const user = ref<IUser | null>(null)
    const sessionToken = ref<string | null>(null)
    const authenticated = computed(() => user.value !== null)

    const authenticate = async (username: string, totp: string): Promise<boolean> => {
      try {
        const response = await fetch(`${API_URL}/api/login?username=${encodeURIComponent(username)}&totp=${encodeURIComponent(totp)}`, {
          method: 'POST',
        })
        if (response.ok) {
          const data = await response.json()
          user.value = data.user
          sessionToken.value = data.token
        }
        return response.ok
      } catch (e) {
        return false
      }
    }

    const aFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      return fetch(input, {
        ...init,
        headers: {
          ...init?.headers,
          Authorization: `Bearer ${sessionToken.value}`,
        },
      })
    }

    return {
      user: user,
      sessionToken, authenticated, authenticate
    }
  },

)
