import { ref } from "vue";

export const mockData = ref([
    { id: 1, date: '2025-10-23', startTime: '00:00', endTime: '01:00', usage: 1.2, cost: 0.14 },
    { id: 2, date: '2025-10-23', startTime: '01:00', endTime: '02:00', usage: 0.8, cost: 0.09 },
    { id: 3, date: '2025-10-23', startTime: '02:00', endTime: '03:00', usage: 0.5, cost: 0.12 },

    { id: 4, date: '2025-10-24', startTime: '00:00', endTime: '01:00', usage: 1.2, cost: 0.18 },
    { id: 5, date: '2025-10-24', startTime: '01:00', endTime: '02:00', usage: 0.8, cost: 0.11 },
    { id: 6, date: '2025-10-24', startTime: '02:00', endTime: '03:00', usage: 0.5, cost: 0.08 },

    { id: 7, date: '2025-10-25', startTime: '00:00', endTime: '01:00', usage: 1.2, cost: 0.16 },
    { id: 8, date: '2025-10-25', startTime: '01:00', endTime: '02:00', usage: 0.8, cost: 0.13 },
    { id: 9, date: '2025-10-25', startTime: '02:00', endTime: '03:00', usage: 0.5, cost: 0.07 },

    { id: 10, date: '2025-10-26', startTime: '00:00', endTime: '01:00', usage: 1.2, cost: 0.17 },
    { id: 11, date: '2025-10-26', startTime: '01:00', endTime: '02:00', usage: 0.8, cost: 0.12 },
    { id: 12, date: '2025-10-26', startTime: '02:00', endTime: '03:00', usage: 0.5, cost: 0.10 },

    { id: 13, date: '2025-10-27', startTime: '00:00', endTime: '01:00', usage: 1.2, cost: 0.15 },
    { id: 14, date: '2025-10-27', startTime: '01:00', endTime: '02:00', usage: 0.8, cost: 0.05 },
    { id: 15, date: '2025-10-27', startTime: '02:00', endTime: '03:00', usage: 0.5, cost: 0.09 },

    { id: 16, date: '2025-10-28', startTime: '00:00', endTime: '01:00', usage: 1.2, cost: 0.19 },
    { id: 17, date: '2025-10-28', startTime: '01:00', endTime: '02:00', usage: 0.8, cost: 0.10 },
    { id: 18, date: '2025-10-28', startTime: '02:00', endTime: '03:00', usage: 0.5, cost: 0.07 },

    { id: 19, date: '2025-10-29', startTime: '00:00', endTime: '01:00', usage: 1.2, cost: 0.13 },
    { id: 20, date: '2025-10-29', startTime: '01:00', endTime: '02:00', usage: 0.8, cost: 0.09 },
    { id: 21, date: '2025-10-29', startTime: '02:00', endTime: '03:00', usage: 0.5, cost: 0.11 },

    { id: 22, date: '2025-10-30', startTime: '00:00', endTime: '01:00', usage: 1.2, cost: 0.20 },
    { id: 23, date: '2025-10-30', startTime: '01:00', endTime: '02:00', usage: 0.8, cost: 0.14 },
    { id: 24, date: '2025-10-30', startTime: '02:00', endTime: '03:00', usage: 0.5, cost: 0.08 },

    { id: 25, date: '2025-10-31', startTime: '00:00', endTime: '01:00', usage: 1.2, cost: 0.17 },
    { id: 26, date: '2025-10-31', startTime: '01:00', endTime: '02:00', usage: 0.8, cost: 0.12 },
    { id: 27, date: '2025-10-31', startTime: '02:00', endTime: '03:00', usage: 0.5, cost: 0.10 },

    { id: 28, date: '2025-11-01', startTime: '00:00', endTime: '01:00', usage: 1.2, cost: 0.18 },
    { id: 29, date: '2025-11-01', startTime: '01:00', endTime: '02:00', usage: 0.8, cost: 0.11 },
    { id: 30, date: '2025-11-01', startTime: '02:00', endTime: '03:00', usage: 0.5, cost: 0.09 },
])


export function countInArray(arr, key, value) {
    return arr.reduce((count, item) => count + (item[key] === value ? 1 : 0), 0)
}

export function totalCost(arr, cost = 0) {
    return arr.reduce((total, item) => total + Number(item.cost || 0), cost)
}

export function totalUsage(arr) {
    return arr.reduce((total, item) => total + Number(item.usage || 0), 0)
}

export function totalTime(arr) {
    return arr.reduce((total, item) => {
        const [sh, sm] = item.startTime.split(':').map(Number)
        const [eh, em] = item.endTime.split(':').map(Number)
        const startMinutes = sh * 60 + sm
        const endMinutes = eh * 60 + em
        const diff = (endMinutes - startMinutes) / 60
        return total + Math.max(diff, 0)
    }, 0)
}
