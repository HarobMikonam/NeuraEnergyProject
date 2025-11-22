<script setup>
import { ref, shallowRef } from 'vue'
import { sub } from 'date-fns'

const range = shallowRef({
  start: sub(new Date(), { days: 14 }),
  end: new Date()
})
const period = ref('daily')
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
