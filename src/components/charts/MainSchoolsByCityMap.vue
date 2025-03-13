<script lang="ts" setup>
import { registerMap, use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { VisualMapComponent } from 'echarts/components'
import { MapChart } from 'echarts/charts'
import type { EChartsOption } from 'echarts/types/dist/shared'
import {
  GridComponent,
  LegendComponent,
  TitleComponent, ToolboxComponent,
  TooltipComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import type { ILoginsData } from '@/interfaces/ILoginsData.ts'
import { computed, type ComputedRef } from 'vue'
import { hessen } from '@/assets/gemeinden_hessen.ts'
import { useDataStore } from '@/stores/data.ts'

use([CanvasRenderer, VisualMapComponent, MapChart, ToolboxComponent, TitleComponent, TooltipComponent, GridComponent, LegendComponent])

defineProps<{
  data: ILoginsData
}>()

const dataStore = useDataStore()

// @ts-expect-error hessen type is in geoJson format
registerMap('hessen', hessen)

function gradientFromBlueToRed(steps: number): string[] {
  const colors = []
  for (let i = 0; i < steps; i++) {
    const r = Math.floor(255 * i / steps)
    const g = Math.floor(255 * (steps - i) / steps)
    colors.push(`rgb(${r}, 0, ${g})`)
  }
  return colors
}

const echartsOptions: ComputedRef<EChartsOption> = computed(() => {
  return {
    title: {
      text: 'Usage of Lanis-Mobile by city (Last 14 days)',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      showDelay: 0,
      transitionDuration: 0.2,
    },
    visualMap: {
      left: 'right',
      min: 0,
      max: dataStore.dataAsCityMap.max * 0.4,
      inRange: {
        color: [
          '#ffffff',
          ...gradientFromBlueToRed(20),
        ]
      },
      text: ['High', 'Low'],
      calculable: true
    },
    toolbox: {
      show: true,
      //orient: 'vertical',
      left: 'left',
      top: 'top',
      feature: {
        dataView: { readOnly: false },
        restore: {},
        saveAsImage: {}
      }
    },
    series: [
      {
        name: 'Hessen Map',
        type: 'map',
        roam: true,
        map: 'hessen',
        emphasis: {
          label: {
            show: true
          }
        },
        data: dataStore.dataAsCityMap.items
      },
    ]
  }
})
</script>

<template>
  <div class="text-white h-full w-full">
    <v-chart ref="echartRef" :option="echartsOptions" autoresize />
  </div>
</template>
