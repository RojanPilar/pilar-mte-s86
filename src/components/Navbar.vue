<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-cinema-black/90 backdrop-blur-md border-b border-cinema-border" style="background-color: #0a0a0f; border-bottom: 1px solid #1e1e2e;">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style="max-width: 1280px; margin: 0 auto; padding: 0 16px;">
      <div class="flex items-center justify-between h-16" style="display: flex; align-items: center; justify-content: space-between; height: 64px;">

        <!-- Logo -->
        <RouterLink to="/movies" class="flex items-center gap-2 group" style="display: flex; align-items: center; gap: 8px; text-decoration: none;">
          <div class="w-8 h-8 bg-cinema-red rounded-lg flex items-center justify-center shadow-red-glow" style="width: 32px; height: 32px; background-color: #e63946; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px; color: white;">
              <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>
            </svg>
          </div>
          <span class="text-lg font-bold text-cinema-text" style="color: #e8e8f0; font-size: 18px; font-weight: bold;">
            Cinema<span class="text-cinema-red" style="color: #e63946;">RP</span>
          </span>
        </RouterLink>

        <!-- Desktop Nav Links -->
        <div style="display: flex; align-items: center; gap: 16px;">

          <!-- Browse Movies — always visible -->
          <RouterLink
            to="/movies"
            class="nav-link"
            style="color: #8888a8; font-size: 14px; text-decoration: none; padding: 8px 16px;"
          >
            Browse Movies
          </RouterLink>

          <!-- Add Movie — FORCED VISIBILITY LINK -->
          <RouterLink
            to="/addMovie"
            style="display: flex; align-items: center; gap: 6px; padding: 8px 16px; background-color: #e63946; color: white; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none; box-shadow: 0 4px 12px rgba(230,57,70,0.3);"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Movie
          </RouterLink>

        </div>

        <!-- Right Side: user info + logout -->
        <div class="flex items-center gap-3" style="display: flex; align-items: center; gap: 12px;">
          <div class="flex items-center gap-2" style="display: flex; align-items: center; gap: 8px;">
            <!-- Avatar -->
            <div class="w-8 h-8 rounded-full bg-cinema-muted border border-cinema-border flex items-center justify-center text-sm font-semibold text-cinema-text" style="width: 32px; height: 32px; border-radius: 50%; background-color: #2a2a3e; border: 1px solid #1e1e2e; display: flex; align-items: center; justify-content: center; color: #e8e8f0; font-size: 14px; font-weight: 600;">
              {{ auth.userName.charAt(0).toUpperCase() }}
            </div>
            <div class="text-sm" style="font-size: 14px;">
              <span class="text-cinema-subtle block" style="color: #8888a8; font-size: 11px; display: block;">Signed in as</span>
              <span class="text-cinema-text" style="color: #e8e8f0; font-weight: 500;">{{ auth.userName }}</span>
            </div>
          </div>

          <!-- Logout button -->
          <button
            @click="handleLogout"
            class="flex items-center gap-1.5"
            style="display: flex; align-items: center; gap: 6px; background: none; border: none; color: #8888a8; cursor: pointer; font-size: 14px; padding: 8px;"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>

      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>
