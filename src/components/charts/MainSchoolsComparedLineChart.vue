<script setup lang="ts">
import { use } from 'echarts/core'
// keeping in case of change due to performance when there are ~1000 schools?
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import type { EChartsOption } from 'echarts/types/dist/shared'
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import type { ILoginsData } from '@/interfaces/ILoginsData.ts'
import { computed, type ComputedRef } from 'vue'
import { useDataStore } from '@/stores/data.ts'

const dataStore = useDataStore()

use([CanvasRenderer, LineChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent])

const props = defineProps<{
  data: ILoginsData
}>()

//fills in missing days with 0 logins and returns the normalized data
function getSeries(
  data: {
    school_id: number
    day: string
    entry_count: number
  }[],
  keys: string[],
): number[] {
  const series: number[] = []

  keys.forEach((day) => {
    const entry = data.find((d) => d.day === day)
    series.push(entry ? entry.entry_count : 0)
  })
  // sorting jjjj-mm-dd strings by alphabetical order is the same as sorting by date
  return series.sort()
}

const echartsOptions: ComputedRef<EChartsOption> = computed(() => {
  const keys = Object.keys(props.data.data ?? {})
  const sortedUniqueDays = [...props.data.uniqueDaysInOrder].sort()
  return {
    xAxis: {
      type: 'category',
      data: sortedUniqueDays,
      name: 'Date',
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} logins',
      },
    },
    series: keys.map((key) => ({
      data: getSeries(props.data.data[key], sortedUniqueDays),
      type: 'line',
      smooth: true,
      name: key,
      emphasis: {
        focus: 'series',
      },
    })),
    tooltip: {
      nearest: true,
      trigger: 'item',
      formatter: function (params) {
        // @ts-expect-error seriesName exists
        const schoolInfo = dataStore.getSchoolName(params.seriesName)
        // @ts-expect-error seriesName exists
        return `<b>[${params.seriesName}] ${schoolInfo.Name}:</b> ${params.value} logins<br><b>Ort:</b> ${schoolInfo.Ort}<br><b>Region:</b> ${schoolInfo.bezirk.name} (${schoolInfo.bezirk.id})<br><b>Date:</b> ${params.name}`
      },
    },
    backgroundColor: 'transparent',
  }
})
</script>

<template>
  <div class="text-white h-full w-full">
    <v-chart ref="echartRef" :option="echartsOptions" autoresize />
  </div>
</template>

<style scoped></style>
