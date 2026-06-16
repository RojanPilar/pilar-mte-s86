<template>
  <div class="min-h-screen bg-cinema-black flex items-center justify-center px-4 relative overflow-hidden">
    <!-- Background ambiance -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-cinema-red/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-64 h-64 bg-cinema-gold/5 rounded-full blur-3xl"></div>
    </div>

    <div class="w-full max-w-md relative z-10 animate-slide-up">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-2 mb-6">
          <div class="w-10 h-10 bg-cinema-red rounded-xl flex items-center justify-center shadow-red-glow">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>
            </svg>
          </div>
          <span class="text-2xl font-bold text-cinema-text">Cine<span class="text-cinema-red">Vault</span></span>
        </div>
        <h1 class="text-3xl font-bold text-cinema-text mb-2">Welcome back</h1>
        <p class="text-cinema-subtle">Sign in to your account to continue</p>
      </div>

      <!-- Card -->
      <div class="card glow-red p-8">
        <AlertMessage :message="errorMsg" type="error" class="mb-5" />

        <form @submit.prevent="handleLogin" novalidate class="space-y-5">
          <!-- Email -->
          <div>
            <label class="label-text" for="email">Email address</label>
            <input
              id="email"
              v-model.trim="form.email"
              type="email"
              class="input-field"
              placeholder="you@example.com"
              autocomplete="email"
              required
            />
          </div>

          <!-- Password -->
          <div>
            <label class="label-text" for="password">Password</label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="input-field pr-11"
                placeholder="Your password"
                autocomplete="current-password"
                required
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-cinema-subtle hover:text-cinema-text transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            class="btn-primary w-full mt-2"
            :disabled="loading"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Signing in...
            </span>
            <span v-else>Sign in</span>
          </button>
        </form>

        <!-- Admin hint -->
        <div class="mt-5 p-3 bg-cinema-muted/50 rounded-lg border border-cinema-border">
          <p class="text-xs text-cinema-subtle text-center">
            <span class="font-medium text-cinema-gold">Admin demo:</span>
            admin@mail.com / admin123
          </p>
        </div>

        <p class="text-center text-cinema-subtle text-sm mt-5">
          Don't have an account?
          <RouterLink to="/register" class="text-cinema-red hover:text-red-400 font-medium transition-colors">Create one</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { loginUser } from '../api/auth'
import { useAuthStore } from '../stores/auth'
import AlertMessage from '../components/AlertMessage.vue'

const router = useRouter()
const auth = useAuthStore()
const loading = ref(false)
const errorMsg = ref('')
const showPassword = ref(false)

const form = ref({ email: '', password: '' })

async function handleLogin() {
  errorMsg.value = ''
  if (!form.value.email || !form.value.password) {
    errorMsg.value = 'Email and password are required.'
    return
  }

  loading.value = true
  try {
    const res = await loginUser({ email: form.value.email, password: form.value.password })

    // ✅ DEBUG: open browser console to see the exact API response
    console.log('🔐 Login API response:', res.data)

    // The API returns: { access: "token...", isAdmin: true/false }
    const token   = res.data.access
    const isAdmin = res.data.isAdmin === true

    auth.setAuth(token, {
      email: form.value.email,
      isAdmin,
    })

    router.push('/movies')
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Invalid email or password.'
  } finally {
    loading.value = false
  }
}
</script>
