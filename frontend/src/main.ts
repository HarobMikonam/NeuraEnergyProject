import './assets/css/main.css'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import ui from '@nuxt/ui/vue-plugin'

import App from './App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // public login page
    {
      path: '/login',
      component: () => import('./pages/login.vue'),
    },

    // dashboard home (protected)
    {
      path: '/',
      component: () => import('./pages/index.vue'),
      meta: { requiresAuth: true },
    },

    // catch-all: send unknown routes to home (or login)
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

// simple auth check using localStorage
function isLoggedIn() {
  return !!localStorage.getItem('user')
}

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

const app = createApp(App)
app.use(router)
app.use(ui)
app.mount('#app')
