<script setup>
import { h, resolveComponent, ref, watch } from 'vue'
import { randomInt, randomFrom } from '../../utils'

const props = defineProps({
  period: String,
  range: Object
})

const UBadge = resolveComponent('UBadge')

const sampleEmails = [

]

const data = ref([])

watch([() => props.period, () => props.range], () => {
  const sales = []
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
