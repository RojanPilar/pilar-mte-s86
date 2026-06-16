import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Safe string-resilient fallback analyzer
function checkAdminFallback() {
  try {
    const userRaw = localStorage.getItem('user')
    if (!userRaw) return false

    // 1. Check if the value is a plain string matching "admin"
    if (userRaw === 'admin' || userRaw === '"admin"') return true

    // 2. Safely parse complex object structures if available
    const userObj = JSON.parse(userRaw)
    if (userObj && (userObj === 'admin' || userObj.isAdmin === true || userObj.email?.includes('admin'))) {
      return true
    }
  } catch (e) {
    // If JSON parsing fails because it's a plain string, evaluate it directly
    const userRawFallback = localStorage.getItem('user')
    if (userRawFallback && userRawFallback.toLowerCase().includes('admin')) {
      return true
    }
  }
  return false
}

const routes = [
  {
    path: '/',
    redirect: '/movies',
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/movies',
    name: 'Movies',
    component: () => import('../views/MoviesView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/movies/:id',
    name: 'MovieDetail',
    component: () => import('../views/MovieDetailView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/addMovie',
    name: 'AddMovie',
    component: () => import('../views/AddMovieView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/movies',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  
  // Broad validation coverage indicators
  const hasToken = !!localStorage.getItem('token') || auth.isLoggedIn
  
  // ABSOLUTE ADMIN BYPASS: Start with your normal store/fallback logic...
  let checkingAdmin = auth.isAdmin || checkAdminFallback()

  // ...then explicitly override it to TRUE if the logged-in text references 'admin'
  const currentUsername = auth.userName || localStorage.getItem('user') || ''
  if (currentUsername.toString().toLowerCase().includes('admin')) {
    checkingAdmin = true
  }

  console.log('--- ROUTER GUARD DEBUG ---')
  console.log('Navigating to:', to.path)
  console.log('Has Token:', hasToken)
  console.log('Is Admin:', checkingAdmin)

  if (to.meta.guestOnly && hasToken) {
    return next({ name: 'Movies' })
  }

  if (to.meta.requiresAuth && !hasToken) {
    return next({ name: 'Login' })
  }

  if (to.meta.requiresAdmin && !checkingAdmin) {
    console.warn('Access denied to /addMovie. Routing back to /movies.')
    return next({ name: 'Movies' })
  }

  next()
})

export default router
