import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Decode JWT payload without a library
function parseJwt(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(json)
  } catch {
    return {}
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user  = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  const isLoggedIn = computed(() => !!token.value)

  // Read isAdmin from 3 possible places so it never silently fails:
  // 1. JWT payload (most reliable)
  // 2. user object saved in localStorage
  // 3. fallback false
  const isAdmin = computed(() => {
    if (token.value) {
      const payload = parseJwt(token.value)
      if (payload.isAdmin === true) return true
    }
    if (user.value?.isAdmin === true) return true
    return false
  })

  const userName = computed(() => user.value?.email?.split('@')[0] || 'User')

  function setAuth(tokenVal, userData) {
    token.value = tokenVal
    user.value  = userData
    localStorage.setItem('token', tokenVal)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function logout() {
    token.value = null
    user.value  = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return { token, user, isLoggedIn, isAdmin, userName, setAuth, logout }
})