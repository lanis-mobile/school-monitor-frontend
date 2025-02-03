import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type {IUser} from "@/interfaces/IUser.ts";
import { API_URL } from '@/main.ts'

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
      const response = await fetch(`${API_URL}${input}`, {
        ...init,
        headers: {
          ...init?.headers,
          Authorization: `Bearer ${sessionToken.value}`,
        },
      })

      if (response.status === 401) {
        user.value = null
        sessionToken.value = null
        window.location.reload();
      }

      return response;
    }

    return {
      user: user,
      sessionToken, authenticated, authenticate, aFetch
    }
  },
)
