<script setup>
import { ref, shallowRef, watch, onMounted } from 'vue'
import { sub } from 'date-fns'
import { fetchMeasurements } from '../utils/mockData'

const range = shallowRef({
  start: sub(new Date(), { days: 14 }),
  end: new Date()
})
const period = ref('daily')

watch(range, (newRange) => {
  if (newRange.start) {
    fetchMeasurements(newRange.start, newRange.end)
  }
}, { immediate: true })
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>

      <UDashboardToolbar>
        <template #left>
          <!-- NOTE: The `-ms-1` class is used to align with the `DashboardSidebarCollapse` button here. -->
          <HomeDateRangePicker v-model="range" class="-ms-1" />

          <HomePeriodSelect v-model="period" :range="range" />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <HomeStats :period="period" :range="range" />
      <HomeChart :period="period" :range="range" />
    </template>
  </UDashboardPanel>
</template>
