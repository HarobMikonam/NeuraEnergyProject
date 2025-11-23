<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchMeasurements } from './utils/mockData'

const route = useRoute()

const open = ref(false)

const links = [[{
  label: 'Home',
  icon: 'i-lucide-house',
  to: '/',
  onSelect: () => {
    open.value = false
  }
}]] 
</script>

<template>
  <Suspense>
    <UApp>
      <UDashboardGroup v-if="route.path !== '/login'" unit="rem" storage="local">
        <UDashboardSidebar
          id="default"
          v-model:open="open"
          collapsible
          resizable
          class="bg-elevated/25"
          :ui="{ footer: 'lg:border-t lg:border-default' }"
        >
          <template #default="{ collapsed }">

            <UNavigationMenu
              :collapsed="collapsed"
              :items="links[0]"
              orientation="vertical"
              tooltip
              popover
            />

            <UNavigationMenu
              :collapsed="collapsed"
              :items="links[1]"
              orientation="vertical"
              tooltip
              class="mt-auto"
            />
          </template>

          <template #footer="{ collapsed }">
            <UserMenu :collapsed="collapsed" />
          </template>
        </UDashboardSidebar>

        <RouterView />

      </UDashboardGroup>
      
      <RouterView v-else />
    </UApp>
  </Suspense>
</template>
