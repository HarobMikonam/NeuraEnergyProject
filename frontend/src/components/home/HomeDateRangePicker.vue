<script setup>
import { computed, ref } from 'vue'
import { DateFormatter, getLocalTimeZone, CalendarDate, today } from '@internationalized/date'
import { mockData } from '../../utils/mockData'

const df = new DateFormatter('en-US', {
  dateStyle: 'medium'
})

const selected = defineModel({ required: true })

const ranges = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 14 days', days: 14 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 3 months', months: 3 },
  { label: 'Last 6 months', months: 6 },
  { label: 'Last year', years: 1 }
]

const toCalendarDate = (date) => {
  return new CalendarDate(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  )
}

const calendarRange = computed({
  get: () => ({
    start: selected.value.start ? toCalendarDate(selected.value.start) : undefined,
    end: selected.value.end ? toCalendarDate(selected.value.end) : undefined
  }),
  set: (newValue) => {
    selected.value = {
      start: newValue.start ? newValue.start.toDate(getLocalTimeZone()) : new Date(),
      end: newValue.end ? newValue.end.toDate(getLocalTimeZone()) : new Date()
    }
  }
})

const isRangeSelected = (range) => {
  if (!selected.value.start || !selected.value.end) return false

  const currentDate = today(getLocalTimeZone())
  let startDate = currentDate.copy()

  if (range.days) {
    startDate = startDate.subtract({ days: range.days })
  } else if (range.months) {
    startDate = startDate.subtract({ months: range.months })
  } else if (range.years) {
    startDate = startDate.subtract({ years: range.years })
  }

  const selectedStart = toCalendarDate(selected.value.start)
  const selectedEnd = toCalendarDate(selected.value.end)

  return selectedStart.compare(startDate) === 0 && selectedEnd.compare(currentDate) === 0
}

const selectRange = (range) => {
  const endDate = today(getLocalTimeZone())
  let startDate = endDate.copy()

  if (range.days) {
    startDate = startDate.subtract({ days: range.days })
  } else if (range.months) {
    startDate = startDate.subtract({ months: range.months })
  } else if (range.years) {
    startDate = startDate.subtract({ years: range.years })
  }

  selected.value = {
    start: startDate.toDate(getLocalTimeZone()),
    end: endDate.toDate(getLocalTimeZone())
  }
}

// Modal Logic
const isModalOpen = ref(false)
const activeTab = ref('insert') // 'insert' or 'delete'

// Insert Form
const formData = ref({
  date: '',
  startTime: '',
  endTime: '',
  usage: 0,
  cost: 0,
})

const insertData = () => {
  mockData.value.push({
    id: Date.now(),
    ...formData.value
  })

  formData.value = {
    date: '',
    startTime: '',
    endTime: '',
    usage: 0,
    cost: 0,
  }
  alert('Data inserted successfully')
}

const deleteData = (id) => {
  mockData.value = mockData.value.filter(item => item.id !== id)
}

const items = [{
  label: 'Insert Data',
  slot: 'insert',
}, {
  label: 'Delete Data',
  slot: 'delete',
}]

</script>

<template>
  <div class="flex gap-2">
    <UPopover :content="{ align: 'start' }" :modal="true">
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-calendar"
        class="data-[state=open]:bg-elevated group"
      >
        <span class="truncate">
          <template v-if="selected.start">
            <template v-if="selected.end">
              {{ df.format(selected.start) }} - {{ df.format(selected.end) }}
            </template>
            <template v-else>
              {{ df.format(selected.start) }}
            </template>
          </template>
          <template v-else>
            Pick a date
          </template>
        </span>

        <template #trailing>
          <UIcon name="i-lucide-chevron-down" class="shrink-0 text-dimmed size-5 group-data-[state=open]:rotate-180 transition-transform duration-200" />
        </template>
      </UButton>

      <template #content>
        <div class="flex items-stretch sm:divide-x divide-default">
          <div class="hidden sm:flex flex-col justify-center">
            <UButton
              v-for="(range, index) in ranges"
              :key="index"
              :label="range.label"
              color="neutral"
              variant="ghost"
              class="rounded-none px-4"
              :class="[isRangeSelected(range) ? 'bg-elevated' : 'hover:bg-elevated/50']"
              truncate
              @click="selectRange(range)"
            />
          </div>

          <UCalendar
            v-model="calendarRange"
            class="p-2"
            :number-of-months="2"
            range
          />
        </div>
      </template>
    </UPopover>

    <UButton
      label="Manage Data"
      color="neutral"
      variant="outline"
      icon="i-lucide-database"
      @click="isModalOpen = true"
    />

    <UModal v-model:open="isModalOpen" title="Manage Electricity Data" description="Insert or delete usage records.">
      <template #body>
        <UTabs :items="items" class="w-full">
          <template #insert>
            <form @submit.prevent="insertData" class="space-y-4 mt-4">
              <UFormField label="Date">
                <UInput type="date" v-model="formData.date" required class="w-full" />
              </UFormField>
              <div class="grid grid-cols-2 gap-4">
                <UFormField label="Start Time">
                  <UInput type="time" v-model="formData.startTime" required class="w-full" />
                </UFormField>
                <UFormField label="End Time">
                  <UInput type="time" v-model="formData.endTime" required class="w-full" />
                </UFormField>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <UFormField label="Usage (kWh)">
                  <UInput type="number" step="0.01" v-model="formData.usage" required class="w-full" />
                </UFormField>
                <UFormField label="Cost ($)">
                  <UInput type="number" step="0.01" v-model="formData.cost" required class="w-full" />
                </UFormField>
              </div>
              <UButton type="submit" label="Insert Record" block />
            </form>
          </template>

          <template #delete>
            <div class="mt-4 space-y-2 max-h-96 overflow-y-auto">
              <div v-if="mockData.length === 0" class="text-center text-gray-500 py-4">
                No data available.
              </div>
              <div v-for="item in mockData" :key="item.id" class="flex items-center justify-between p-3 border rounded-md border-gray-200 dark:border-gray-800">
                <div class="text-sm">
                  <div class="font-medium">{{ item.date }}</div>
                  <div class="text-gray-500">{{ item.startTime }} - {{ item.endTime }} | {{ item.usage }} kWh</div>
                </div>
                <UButton
                  color="error"
                  variant="ghost"
                  icon="i-lucide-trash-2"
                  size="sm"
                  @click="deleteData(item.id)"
                />
              </div>
            </div>
          </template>
        </UTabs>
      </template>
    </UModal>
  </div>
</template>
