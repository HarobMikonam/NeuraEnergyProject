<script setup>
import { VisGroupedBar, VisXYContainer } from '@unovis/vue'
import { ChartContainer } from '@/components/ui/chart'

const chartData = [
  { date: new Date('2024-01-01'), desktop: 186, mobile: 80 },
  { date: new Date('2024-02-01'), desktop: 305, mobile: 200 },
  { date: new Date('2024-03-01'), desktop: 237, mobile: 120 },
  { date: new Date('2024-04-01'), desktop: 73,  mobile: 190 },
  { date: new Date('2024-05-01'), desktop: 209, mobile: 130 },
  { date: new Date('2024-06-01'), desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: '#2563eb',
  },
  mobile: {
    label: 'Mobile',
    color: '#60a5fa',
  },
}
</script>

<template>
  <ChartContainer :config="chartConfig" class="min-h-[200px] w-full rounded-xl border bg-card p-4">
    <VisXYContainer :data="chartData" class="h-[200px]">
      <VisGroupedBar
        :x="(d) => d.date"
        :y="[(d) => d.desktop, (d) => d.mobile]"
        :color="[chartConfig.desktop.color, chartConfig.mobile.color]"
        :rounded-corners="4"
        bar-padding="0.1"
        group-padding="0"
      />
    </VisXYContainer>
  </ChartContainer>
</template>
