import { computed, type ComputedRef, ref } from 'vue'
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

    const getSchoolName = (schoolId: string) => {
      const bezirk = bezirkList.value.find(bezirk => bezirk.Schulen.some(schule => schule.Id === schoolId));
      const schule = bezirk?.Schulen.find(schule => schule.Id === schoolId);
      return {
        ...schule,
        bezirk: {
          id: bezirk?.Id,
          name: bezirk?.Name
        }
      }
    }

    const combinedLoginCount = computed(() => {
      if (!data.value) return 0;
      let result = 0;
      for (const schoolId of Object.keys(data.value.data)) {
        for (const day of data.value.data[schoolId]) {
          result += day.entry_count;
        }
      }
      return result;
    });

    const getSchoolLoginCount = (schoolId: string): number => {
      if (!data.value) return 0;
      let total = 0;
      if (!data.value.data[schoolId]) return 0;
      for (const day of data.value.data[schoolId]) {
        total += day.entry_count;
      }
      return total;
    }

    const activeSchoolList: ComputedRef<{   Id: string, Name: string, Ort: string }[]> = computed(() => {
      if (!data.value) return [];
      return schoolList.value
        .filter(school => data.value?.data[school.Id] !== undefined)
        .map(school => ({
          Id: school.Id,
          Name: school.Name,
          Ort: school.Ort,
          entry_count: getSchoolLoginCount(school.Id)
        }))
        .sort((a, b) => b.entry_count - a.entry_count)
    });

    return {data, fetchData, getSchoolInfo: getSchoolName, bezirkList, schoolList, activeSchoolList, combinedLoginCount, getSchoolLoginCount}
  },

)
