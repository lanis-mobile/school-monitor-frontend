import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import type { IUser } from '@/interfaces/IUser.ts'
import { API_URL } from '@/main.ts'

export const useSessionStore = defineStore('session',
  () => {
    const user = ref<IUser | null>(JSON.parse(sessionStorage.getItem('user') || 'null'))
    const sessionToken = ref<string | null>(sessionStorage.getItem('sessionToken'))
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
        console.warn(e)
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
        sessionStorage.removeItem('user')
        sessionStorage.removeItem('sessionToken')
        window.location.reload();
      }

      return response;
    }

    // Watch for changes and update sessionStorage
    watch(user, (newUser) => {
      if (newUser) {
        sessionStorage.setItem('user', JSON.stringify(newUser))
      } else {
        sessionStorage.removeItem('user')
      }
    })

    watch(sessionToken, (newToken) => {
      if (newToken) {
        sessionStorage.setItem('sessionToken', newToken)
      } else {
        sessionStorage.removeItem('sessionToken')
      }
    })

    return {
      user,
      sessionToken,
      authenticated,
      authenticate,
      aFetch
    }
  },
)
