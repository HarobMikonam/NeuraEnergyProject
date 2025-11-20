<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'

const router = useRouter()

const { isLoggedIn, logout } = useAuth()

const goToLogin = () => {
  console.log("Login Button")
  router.push('/login')
}

const goToDashboard = () => {
  router.push('/dashboard')
}

const Logout = () => {
  logout()
  router.push('/login')
}
console.log()

</script>

<template>
  <div class="navbar bg-base-100 shadow-sm">
    <div class="flex-1">
      <a class="btn btn-ghost text-xl" @click="goToDashboard">
        NeuraEnergy
      </a>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1">
        <li v-if="isLoggedIn">
          <a @click="goToDashboard">Graphs</a>
        </li>
        <li v-if="!isLoggedIn">
          <a @click="goToLogin">Login</a>
        </li>
        <li v-if="isLoggedIn">
          <a @click="Logout">Logout</a>
        </li>
      </ul>
    </div>
  </div>
</template>