import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import ui from '@nuxt/ui/vue-plugin'

import './assets/css/main.css'

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // public route
    { path: '/login', component: () => import('./pages/login.vue') },
    { path: '/dashboard', redirect: '/' },

    // protected routes
    {
      path: '/',
      component: () => import('./pages/index.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/inbox',
      component: () => import('./pages/inbox.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/customers',
      component: () => import('./pages/customers.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/settings',
      component: () => import('./pages/settings.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          component: () => import('./pages/settings/index.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'members',
          component: () => import('./pages/settings/members.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'notifications',
          component: () => import('./pages/settings/notifications.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'security',
          component: () => import('./pages/settings/security.vue'),
          meta: { requiresAuth: true },
        },
      ],
    },
  ],
})

// simple front-end auth check
function isLoggedIn() {
  return !!localStorage.getItem('user')
}

// global guard: protect routes + handle login redirect
router.beforeEach((to, from, next) => {
  const loggedIn = isLoggedIn()

  if (to.meta.requiresAuth && !loggedIn) {
    return next('/login')
  }

  if (to.path === '/login' && loggedIn) {
    return next('/')
  }

  next()
})

app.use(router)
app.use(ui)
app.mount('#app')
