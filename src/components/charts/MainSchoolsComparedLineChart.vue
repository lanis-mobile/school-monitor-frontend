<script setup lang="ts">
import { use } from 'echarts/core';
// keeping in case of change due to performance when there are ~1000 schools?
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import type { EChartsOption } from 'echarts/types/dist/shared';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components';
import VChart from 'vue-echarts';
import type { ILoginsData } from '@/interfaces/ILoginsData.ts'
import { computed, type ComputedRef } from 'vue'
import { useDataStore } from '@/stores/data.ts'

const dataStore = useDataStore()

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
]);



const props = defineProps<{
  data: ILoginsData
}>()


//fills in missing days with 0 logins and returns the normalized data
function getSeries(data: {
  school_id: number;
  day: string;
  entry_count: number;
}[], keys: string[]): number[] {
  const series: number[] = [];

  keys.forEach(day => {
    const entry = data.find(d => d.day === day);
    series.push(entry ? entry.entry_count : 0);
  });

  return series;
}

const echartsOptions: ComputedRef<EChartsOption> = computed(() => {
  const keys = Object.keys(props.data.data ?? {});
  return {
    xAxis: {
      type: 'category',
      data: props.data.uniqueDaysInOrder,
      name: 'Date',
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} logins'
      },
    },
    series: keys.map(key => ({
      data: getSeries(props.data.data[key], props.data.uniqueDaysInOrder),
      type: 'line',
      smooth: true,
      name: key,
      emphasis: {
        focus: 'series',

      },
    })),
    tooltip: {
      nearest: true,
      trigger: "item",
      formatter: function (params) {
        const schoolInfo = dataStore.getSchoolName(params.seriesName);
        return `<b>[${params.seriesName}] ${schoolInfo.Name}:</b> ${params.value} logins<br>
                <b>Ort:</b> ${schoolInfo.Ort}<br>
                <b>Region:</b> ${schoolInfo.bezirk.name} (${schoolInfo.bezirk.id})<br>
                <b>Date:</b> ${params.name}`;
      }
    },
    backgroundColor: 'transparent',
  }
})

</script>

<template>
  <div class="text-white h-full w-full">
    <v-chart ref="echartRef" :option="echartsOptions"  autoresize />
  </div>

</template>

<style scoped>

</style>
