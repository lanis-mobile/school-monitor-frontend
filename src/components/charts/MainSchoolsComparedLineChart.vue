<script setup lang="ts">
import { use } from 'echarts/core'
// keeping in case of change due to performance when there are ~1000 schools?
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import type { CallbackDataParams, EChartsOption } from 'echarts/types/dist/shared'
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
  return series
}

// @ts-expect-error configuration is valid
const echartsOptions: ComputedRef<EChartsOption> = computed(() => {
  const keys = Object.keys(props.data.data ?? {})
  // format YYYY-MM-DD
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
    toolbox: {
      feature: {
        saveAsImage: {},
      }
    },
    series: keys.map((key) => ({
      data: getSeries(props.data.data[key], sortedUniqueDays),
      type: 'line',
      displayName: dataStore.getSchoolInfo(key).Name,
      smooth: true,
      name: key,
      emphasis: {
        focus: 'none',
      },
    })),
    tooltip: {
      nearest: true,
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: function (params: CallbackDataParams[]) {
        const limit = 25
        let hidden = 0

        // @ts-expect-error data exists
        let sorted = [...params].filter(value => value.value !== 0).sort((a, b) => b.value - a.value)
        if (sorted.length > limit) {
          hidden = sorted.length - limit
          sorted = sorted.slice(0, limit)
        }
        const stringparts = sorted.map((param) => {
          // @ts-expect-error data exists
          const schoolInfo = dataStore.getSchoolInfo(param.seriesName)
          return `<div style="background-color: ${param.color}" class="rounded-full h-2 w-2 inline-flex mr-1"></div><b>${param.seriesName} ${schoolInfo.Name} ${schoolInfo.Ort}:</b> ${param.value}<br>`
        })
        // @ts-expect-error data exists
        const total = params.reduce((acc, curr) => acc + curr.value, 0)
        return `${params[0].name}  <b>Total logins: ${total}</b><br>${stringparts.join('')}<i>${hidden} more schools hidden</i>`
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
