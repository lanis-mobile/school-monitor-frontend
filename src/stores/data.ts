import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { ILoginsData } from '@/interfaces/ILoginsData.ts'
import { useSessionStore } from '@/stores/session.ts'
import type { ISchoolBezirk } from '@/interfaces/ISchoolBezirk.ts'
import { API_URL } from '@/main.ts'


export const useDataStore = defineStore('data',
  () => {
    const data = ref<ILoginsData | null>(null);
    const bezirkList = ref<ISchoolBezirk[] | []>([]);
    const schoolList = computed(() => bezirkList.value.flatMap(bezirk => bezirk.Schulen));

    const fetchData = async (): Promise<void> => {
      const sessionStore = useSessionStore();
      const response = await sessionStore.aFetch(`/api/data`);
      if (response.ok) {
        data.value = await response.json()
      }
    }

    const fetchBezirkList = async (): Promise<void> => {
      if (bezirkList.value.length > 0) return;
      const response = await fetch(`${API_URL}/api/lanis-school-list`);
      if (response.ok) {
        bezirkList.value = await response.json();
      }
    }

    fetchBezirkList();

    const getSchoolName = (schoolId: string) => schoolList.value.find(school => school.Id === schoolId)?.Name;

    return {data, fetchData, getSchoolName, bezirkList, schoolList}
  },

)
