import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Dashboard from '../components/Dashboard.vue'
import { useAuth } from '../composables/useAuth'

const routes = [
    { name: 'login', path: '/login', component: Login },
    { name: 'dashboard', path: '/dashboard', component: Dashboard },
    { path: '/', redirect: '/login' },
]

// Initialize router object where it decides which component to render based on the current URL
export const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const { isLoggedIn } = useAuth()
    const publicPages = ['/login']
    const authRequired = !publicPages.includes(to.path)

    if (authRequired && !isLoggedIn.value) {
        return next('/login')
    }

    next()
})


export default router