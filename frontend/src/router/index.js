import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Dashboard from '../components/Dashboard.vue'

const routes = [
    { path: '/login', component: Login },
    { path: '/dashboard', component: Dashboard }
]

// Initialize router object where it decides which component to render based on the current URL
export const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router