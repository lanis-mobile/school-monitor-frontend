<script lang="ts" setup>
import { use } from 'echarts/core'
// keeping in case of change due to performance when there are ~1000 schools?
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart } from 'echarts/charts'
import type { CallbackDataParams, EChartsOption } from 'echarts/types/dist/shared'
import {
  GridComponent,
  LegendComponent,
  TitleComponent, ToolboxComponent,
  TooltipComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import type { ILoginsData } from '@/interfaces/ILoginsData.ts'
import { computed, type ComputedRef } from 'vue'
import { useDataStore } from '@/stores/data.ts'

const dataStore = useDataStore()

use([CanvasRenderer, LineChart, BarChart, ToolboxComponent, TitleComponent, TooltipComponent, GridComponent, LegendComponent])

const props = defineProps<{
  data: ILoginsData
}>()

// Returns the total logins per day
function getTotalLoginsSeries(data: ILoginsData, keys: string[]): number[] {
  const loginsPerDay: Record<string, number> = {}

  keys.forEach((day) => {
    loginsPerDay[day] = 0
  })

  Object.keys(data.data).forEach((school) => {
    data.data[school].forEach((entry) => {
      loginsPerDay[entry.day] += entry.entry_count
    })
  })

  return keys.map((day) => loginsPerDay[day])
}

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
    series: {
      data: getTotalLoginsSeries(props.data, sortedUniqueDays),
      type: 'bar',
      displayName: 'Total logins',
      smooth: true,
      emphasis: {
        focus: 'none',
      },
    },
    tooltip: {
      nearest: true,
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: function (param: CallbackDataParams[]) {
        const logins = param[0].value
        // format YYYY-MM-DD
        const date = param[0].name
        const weekdaystrgerman = new Date(date).toLocaleDateString('de-DE', { weekday: 'long' })

        return `${date}<br>${weekdaystrgerman}<br><b>${logins}</b> logins`
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
