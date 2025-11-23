const API_URL = 'http://127.0.0.1:8000'

export const routes = {
    api: {
        login: '/login/',
        measurements: '/api/measurements/'
    }
}

export function baseUrl(endpoint) {
  return API_URL + endpoint
}