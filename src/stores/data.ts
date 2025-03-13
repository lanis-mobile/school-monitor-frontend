import { computed, type ComputedRef, ref } from 'vue'
import { defineStore } from 'pinia'
import type { ILoginsData } from '@/interfaces/ILoginsData.ts'
import { useSessionStore } from '@/stores/session.ts'
import type { ISchoolBezirk } from '@/interfaces/ISchoolBezirk.ts'
import { API_URL } from '@/main.ts'
import { gemeindenTitleFuse } from '@/assets/gemeinden_hessen_keys.ts'


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

    const getSchoolLoginCount = (schoolId: string, lastDays?: number): number => {
      if (!data.value) return 0;
      let total = 0;
      if (!data.value.data[schoolId]) return 0;
      const today = new Date();
      for (const day of data.value.data[schoolId]) {
        if (lastDays) {
          const entryDate = new Date(day.day);
          const diffTime = Math.abs(today.getTime() - entryDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays > lastDays) continue;
        }
        total += day.entry_count;
      }
      return total;
    }

    const dataAsCityMap: ComputedRef<{
      max: number,
      items: { name: string, value: number }[]
    }> = computed(() => {
      if (!data.value) return { max: 0, items: [] };
      const result: { [key: string]: number } = {};
      for (const bezirk of bezirkList.value) {
        for (const school of bezirk.Schulen) {
          const search = gemeindenTitleFuse.search(school.Ort)
          if (search.length === 0) {
            console.log(`No match found for ${school.Ort}`);
            continue;
          }
          const locationKey = search[0].item
          if (locationKey)
          if (result[locationKey] === undefined) {
            result[locationKey] = 0;
          }
          result[locationKey] += getSchoolLoginCount(school.Id, 14);
        }
      }
      const items = Object.entries(result).map(([name, value]) => ({ name, value }));
      const max = Math.max(...items.map(item => item.value), 0);
      console.log({ max, items });
      return { max, items };
    });

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

    const dataToCsv = (): string => {
      if (!data.value) return '';
      const header = ['Date', ...activeSchoolList.value.map(school => `"${school.Name} (${school.Ort}, ${school.Id})"`)];
      const rows = [];
      rows.push(header.join(','));
      ([...data.value.uniqueDaysInOrder].sort()).forEach(day => {
        const row = [day];
        activeSchoolList.value.forEach(school => {
          const entry = data.value!.data[school.Id].find(entry => entry.day === day);
          row.push(entry?.entry_count.toString() ?? '0');
        });
        rows.push(row.map(value => `"${value}"`).join(','));
      });
      return rows.join('\n');
    }

    return {data, fetchData, getSchoolInfo: getSchoolName, dataAsCityMap, bezirkList, schoolList, activeSchoolList, combinedLoginCount, getSchoolLoginCount, dataToCsv}
  },

)
