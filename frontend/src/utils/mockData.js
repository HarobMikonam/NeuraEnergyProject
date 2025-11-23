import { ref } from "vue";
import { baseUrl, routes } from "./routes";

export const measurements = ref([]);
export const mockData = measurements;


// helpers to avoid timezone shifts
const pad = n => String(n).padStart(2, '0');
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;

export async function fetchMeasurements(startDate, endDate) {
  try {
    let url = `${baseUrl(routes.api.measurements)}?`;
    const params = new URLSearchParams();

    const hasStart = startDate instanceof Date && !isNaN(startDate);
    const hasEnd   = endDate   instanceof Date && !isNaN(endDate);

    if (hasStart) params.set('start_date', ymd(startDate));
    if (hasStart && !hasEnd) {
      params.set('end_date', ymd(startDate));
    } else if (hasEnd) {
      params.set('end_date', ymd(endDate));
    }

    if ([...params].length) url += `?${params.toString()}`;

    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error('Failed to fetch measurements');
    const body = await res.json();
    const list = Array.isArray(body) ? body : (body.results ?? []);

    measurements.value = list.map(item => ({
      id: item.id,
      date: item.date,
      startTime: item.start_time,   // HH:MM (or HH:MM:SS)
      endTime: item.end_time,
      usage: item.usage,
      cost: Number(item.cost)
    }));
  } catch (e) {
    console.error('Error fetching measurements:', e);
  }
}

export async function fetchMeasurementById(id) {
    try {
        const response = await fetch(`${baseUrl(routes.api.measurements)}${id}/`, { headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error('Failed to fetch measurement');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching measurement:', error);
        return null;
    }
}

export async function createMeasurement(measurement) {
    try {

        const payload = {
            date: measurement.date,
            start_time: measurement.startTime,
            end_time: measurement.endTime,
            usage: measurement.usage,
            cost: measurement.cost
        };

        const response = await fetch(baseUrl(routes.api.measurements), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Failed to create measurement');
        
        const data = await response.json();
        const newMeasurement = await fetchMeasurementById(data.id);
        
        if (newMeasurement) {
            const formatted = {
                id: newMeasurement.id,
                date: newMeasurement.date,
                startTime: newMeasurement.start_time,
                endTime: newMeasurement.end_time,
                usage: newMeasurement.usage,
                cost: Number(newMeasurement.cost)
            }
            measurements.value.push(formatted)
        }
        return true;
    } catch (error) {
        console.error('Error creating measurement:', error);
        return false;
    }
}

export async function deleteMeasurement(id) {
    try {
        const response = await fetch(`${baseUrl(routes.api.measurements)}${id}/`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete measurement');

        // Refresh data or filter locally
        measurements.value = measurements.value.filter(item => item.id !== id);
        return true;
    } catch (error) {
        console.error('Error deleting measurement:', error);
        return false;
    }
}

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
