<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200">
    <div class="card w-full max-w-md bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title justify-center mb-4">Login</h2>

        <div class="form-control w-full mb-3">
          <label class="label">
            <span class="label-text">Email</span>
          </label>
          <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            class="input input-bordered w-full"
          />
        </div>

        <div class="form-control w-full mb-4">
          <label class="label">
            <span class="label-text">Password</span>
          </label>
          <input
            v-model="password"
            type="password"
            class="input input-bordered w-full"
          />
        </div>

        <div class="form-control">
          <button class="btn btn-primary w-full">Login</button>
        </div>
      </div>
    </div>
  </div>
</template>