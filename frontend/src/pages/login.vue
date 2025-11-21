<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')

// super basic front-end only auth
const handleLogin = () => {
  if (email.value === 'test@test.com' && password.value === '1234') {
    // “log in” = store something in localStorage
    localStorage.setItem(
      'user',
      JSON.stringify({ email: email.value }),
    )
    error.value = ''
    router.push('/') // go to dashboard
  } else {
    error.value = 'Invalid email or password'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[#18181B] dark">
    <div class="w-full max-w-md rounded-xl bg-white/5 p-6 shadow ring-1 ring-white/10">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-semibold text-white">Log in to your account</h1>
        <p class="text-sm text-gray-400">
          Enter your email and password below to log in
        </p>
      </div>

      <form class="flex flex-col items-center space-y-4" @submit.prevent="handleLogin">
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-200" for="email">
            Email address
          </label>
          <!-- UInput is from Nuxt UI (already configured in your template) -->
          <UInput
            id="email"
            v-model="email"
            type="email"
            placeholder="email@example.com"
            required
            autofocus
            :ui="{ color: { white: { outline: 'shadow-sm bg-white/5 dark:bg-white/5 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-[#42B883]' } } }"
          />
        </div>

        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-200" for="password">
            Password
          </label>
          <UInput
            id="password"
            v-model="password"
            type="password"
            placeholder="Password"
            required
            :ui="{ color: { white: { outline: 'shadow-sm bg-white/5 dark:bg-white/5 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-[#42B883]' } } }"
          />
        </div>

        <p v-if="error" class="text-sm text-red-500">
          {{ error }}
        </p>

        <UButton type="submit" class="w-full justify-center !bg-[#42B883] hover:!bg-[#42B883]/90 text-white font-semibold">
          Log in
        </UButton>
      </form>

      <p class="mt-4 text-center text-xs text-gray-500">
        Demo creds: <code>test@test.com / 1234</code>
      </p>
    </div>
  </div>
</template>
