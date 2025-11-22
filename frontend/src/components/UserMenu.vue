<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

defineProps({
  collapsed: Boolean
})

const user = ref({
  name: 'Neura Energy',
  avatar: {
    src: 'https://media.licdn.com/dms/image/v2/D560BAQGYRdF2QUcgrg/company-logo_200_200/company-logo_200_200/0/1715631789834/neuraenergy_logo?e=1765411200&v=beta&t=ZpT2tVkxJX_sxOHGhLgJE8t7GU-6EE7jF0hegBkmAnU',
    alt: 'Neura Energy'
  }
})

const router = useRouter()

// Only show the user label and a "Log out" item
const items = computed(() => ([
  [
    {
      type: 'label',
      label: user.value.name,
      avatar: user.value.avatar
    }
  ],
  [
    {
      label: 'Log out',
      icon: 'i-lucide-log-out',
      onSelect: () => {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        router.push('/login')
      }
    }
  ]
]))
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }"
  >
    <UButton
      v-bind="{
        ...user,
        label: collapsed ? undefined : user?.name,
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down'
      }"
      color="neutral"
      variant="ghost"
      block
      :square="collapsed"
      class="data-[state=open]:bg-elevated"
      :ui="{ trailingIcon: 'text-dimmed' }"
    />
  </UDropdownMenu>
</template>
