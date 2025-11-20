import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'


const Routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default Routes