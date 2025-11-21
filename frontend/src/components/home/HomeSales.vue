<script setup lang="ts">
import { h, resolveComponent, ref, watch } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { randomInt, randomFrom } from '../../utils'
import type { Period, Range, Sale } from '../../types'

const props = defineProps<{
  period: Period
  range: Range
}>()

const UBadge = resolveComponent('UBadge')

const sampleEmails = [
  'james.anderson@example.com',
  'mia.white@example.com',
  'william.brown@example.com',
  'emma.davis@example.com',
  'ethan.harris@example.com'
]

const data = ref<Sale[]>([])

watch([() => props.period, () => props.range], () => {
  const sales: Sale[] = []
  const currentDate = new Date()

  for (let i = 0; i < 5; i++) {
    const hoursAgo = randomInt(0, 48)
    const date = new Date(currentDate.getTime() - hoursAgo * 3600000)

    sales.push({
      id: (4600 - i).toString(),
      date: date.toISOString(),
      status: randomFrom(['paid', 'failed', 'refunded']),
      email: randomFrom(sampleEmails),
      amount: randomInt(100, 1000)
    })
  }

  data.value = sales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}, { immediate: true })

</script>

<template>

</template>
