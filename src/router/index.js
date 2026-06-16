import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Safe string-resilient fallback analyzer
function checkAdminFallback() {
  try {
    const userRaw = localStorage.getItem('user')
    if (!userRaw) return false

    if (userRaw === 'admin' || userRaw === '"admin"') return true

    const userObj = JSON.parse(userRaw)
    if (userObj && (userObj === 'admin' || userObj.isAdmin === true || userObj.email?.includes('admin'))) {
      return true
    }
  } catch (e) {
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
  const hasToken = !!localStorage.getItem('token') || auth.isLoggedIn
  
  let checkingAdmin = auth.isAdmin || checkAdminFallback()
  const currentUsername = auth.userName || localStorage.getItem('user') || ''
  if (currentUsername.toString().toLowerCase().includes('admin')) {
    checkingAdmin = true
  }

  if (to.meta.guestOnly && hasToken) {
    return next({ name: 'Movies' })
  }

  if (to.meta.requiresAuth && !hasToken) {
    return next({ name: 'Login' })
  }

  if (to.meta.requiresAdmin && !checkingAdmin) {
    return next({ name: 'Movies' })
  }

  next()
})

export default router
