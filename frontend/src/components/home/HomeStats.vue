<script setup>
import { ref, watch, computed } from 'vue'
import { mockData, totalCost, totalUsage, countInArray, totalTime } from '../../utils/mockData'

const props = defineProps({
  period: String,
  range: Object
})

const dataLogged = computed(() => mockData.value.length)
const totalUsageKwh = computed(() => totalUsage(mockData.value))
const totalCostUsd = computed(() => totalCost(mockData.value))
const totalTimeHours = computed(() => totalTime(mockData.value))


const formatKWh   = (n) => Number.isFinite(Number(n)) ? `${Number(n).toFixed(2)} kWh` : '—'
const formatHours = (n) => Number.isFinite(Number(n)) ? `${Number(n).toFixed(2)} h`   : '—'

function formatCurrency(n) {
  const x = Number(n)
  return x.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

const stats = computed(() => {
  return [{
    title: 'Data Logged',
    icon: 'i-lucide-database',
    value: dataLogged.value,
  }, {
    title: 'Total Time',
    icon: 'i-lucide-clock',
    value: formatHours(totalTimeHours.value)
  }, {
    title: 'Energy Used',
    icon: 'i-lucide-zap',
    value: formatKWh(totalUsageKwh.value)
  }, {
    title: 'Cost',
    icon: 'i-lucide-dollar-sign',
    value: formatCurrency(totalCostUsd.value)
  }]
})
</script>

<template>
  <UPageGrid class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
    <UPageCard
      v-for="(stat, index) in stats"
      :key="index"
      :icon="stat.icon"
      :title="stat.title"
      to="/customers"
      variant="subtle"
      :ui="{
        container: 'gap-y-1.5',
        wrapper: 'items-start',
        leading: 'p-2.5 rounded-full bg-primary/10 ring ring-inset ring-primary/25',
        title: 'font-normal text-muted text-xs uppercase'
      }"
      class="lg:rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1"
    >
      <div class="flex items-center gap-2">
        <span class="text-2xl font-semibold text-highlighted">
          {{ stat.value }}
        </span>
      </div>
    </UPageCard>
  </UPageGrid>
</template>
