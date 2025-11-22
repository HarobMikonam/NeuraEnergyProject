<script setup>
import { computed, useTemplateRef, ref, watch } from 'vue'
import { eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, format } from 'date-fns'
import { VisXYContainer, VisLine, VisAxis, VisArea, VisCrosshair, VisTooltip } from '@unovis/vue'
import { useElementSize } from '@vueuse/core'

const cardRef = useTemplateRef('cardRef')

const props = defineProps({
  period: String,
  range: Object
})

const { width } = useElementSize(cardRef)

const metrics = [
  { label: 'Cost', value: 'cost' },
  { label: 'Energy Used', value: 'energy' },
  { label: 'Total Active Time', value: 'time' },
  { label: 'Data Points', value: 'points' }
]

const selectedMetric = ref(metrics[0])
const data = ref([])

import { mockData } from '../../utils/mockData'

watch([() => props.period, () => props.range, selectedMetric], () => {
  const dates = ({
    daily: eachDayOfInterval,
    weekly: eachWeekOfInterval,
    monthly: eachMonthOfInterval
  })[props.period](props.range)

  data.value = dates.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd')
    

    const dayData = mockData.value.filter(item => item.date === dateStr)
    
    let amount = 0
    
    if (selectedMetric.value.value === 'cost') {
      amount = dayData.reduce((sum, item) => sum + Number(item.cost || 0), 0)
    } else if (selectedMetric.value.value === 'energy') {
      amount = dayData.reduce((sum, item) => sum + Number(item.usage || 0), 0)
    } else if (selectedMetric.value.value === 'points') {
      amount = dayData.length
    } else if (selectedMetric.value.value === 'time') {

      amount = dayData.reduce((total, item) => {
        if (!item.startTime || !item.endTime) return total
        const [sh, sm] = item.startTime.split(':').map(Number)
        const [eh, em] = item.endTime.split(':').map(Number)
        const startMinutes = sh * 60 + sm
        const endMinutes = eh * 60 + em
        const diff = (endMinutes - startMinutes) / 60
        return total + Math.max(diff, 0)
      }, 0)
    }
    
    return { date, amount }
  })
}, { immediate: true })

const x = (_, i) => i
const y = (d) => d.amount

const total = computed(() => data.value.reduce((acc, { amount }) => acc + amount, 0))

const formatValue = (value) => {
  if (selectedMetric.value.value === 'cost') {
    return new Intl.NumberFormat('en', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
  } else if (selectedMetric.value.value === 'energy') {
    return `${value.toLocaleString()} kWh`
  } else if (selectedMetric.value.value === 'points') {
    return `${value.toLocaleString()} points`
  } else {
    return `${value.toLocaleString()} h`
  }
}

const formatDate = (date) => {
  return ({
    daily: format(date, 'd MMM'),
    weekly: format(date, 'd MMM'),
    monthly: format(date, 'MMM yyy')
  })[props.period]
}

const xTicks = (i) => {
  if (i === 0 || i === data.value.length - 1 || !data.value[i]) {
    return ''
  }

  return formatDate(data.value[i].date)
}

const template = (d) => `${formatDate(d.date)}: ${formatValue(d.amount)}`
</script>

<template>
  <UCard ref="cardRef" :ui="{ root: 'overflow-visible', body: '!px-0 !pt-0 !pb-3' }">
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs text-muted uppercase mb-1.5">
            {{ selectedMetric.label }}
          </p>
          <p class="text-3xl text-highlighted font-semibold">
            {{ formatValue(total) }}
          </p>
        </div>
        
        <USelectMenu
          v-model="selectedMetric"
          :items="metrics"
          class="w-40"
        />
      </div>
    </template>

    <VisXYContainer
      :data="data"
      :padding="{ top: 40 }"
      class="h-96"
      :width="width"
    >
      <VisLine
        :x="x"
        :y="y"
        color="var(--ui-primary)"
      />
      <VisArea
        :x="x"
        :y="y"
        color="var(--ui-primary)"
        :opacity="0.1"
      />

      <VisAxis
        type="x"
        :x="x"
        :tick-format="xTicks"
      />

      <VisCrosshair
        color="var(--ui-primary)"
        :template="template"
      />

      <VisTooltip />
    </VisXYContainer>
  </UCard>
</template>

<style scoped>
.unovis-xy-container {
  --vis-crosshair-line-stroke-color: var(--ui-primary);
  --vis-crosshair-circle-stroke-color: var(--ui-bg);

  --vis-axis-grid-color: var(--ui-border);
  --vis-axis-tick-color: var(--ui-border);
  --vis-axis-tick-label-color: var(--ui-text-dimmed);

  --vis-tooltip-background-color: var(--ui-bg);
  --vis-tooltip-border-color: var(--ui-border);
  --vis-tooltip-text-color: var(--ui-text-highlighted);
}
</style>
