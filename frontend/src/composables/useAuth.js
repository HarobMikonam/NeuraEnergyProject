import { ref } from 'vue'

const isLoggedIn = ref(true)

function login() {
    isLoggedIn.value = true
}

function logout() {
    isLoggedIn.value = false
}

export function useAuth() {
    return { isLoggedIn, login, logout }
}