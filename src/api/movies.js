import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
})

// Automatically pass session tokens securely
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// === Movie Endpoints ===
export const getMovies = () => api.get('/movies/getMovies')

export const getMovie = (id) => api.get(`/movies/getMovie/${id}`)

export const addMovie = (data) => api.post('/movies/addMovie', data)

export const updateMovie = (id, data) => api.patch(`/movies/updateMovie/${id}`, data)

export const deleteMovie = (id) => api.delete(`/movies/deleteMovie/${id}`)

// === Comment Endpoints ===
export const addComment = (id, data) => api.post(`/movies/addComment/${id}`, data)

export const getComments = (id) => api.get(`/movies/getComments/${id}`)
