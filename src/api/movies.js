import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
})

export const addMovie = (movieData) => api.post('/movies', movieData)

export const getMovies = () => api.get('/movies/getMovies')

export const getMovie = (id) => api.get(`/movies/getMovie/${id}`)

export const addMovie = (data) => api.post('/movies/addMovie', data)

export const updateMovie = (id, data) => api.patch(`/movies/updateMovie/${id}`, data)

export const deleteMovie = (id) => api.delete(`/movies/deleteMovie/${id}`)

export const addComment = (id, data) => api.post(`/movies/addComment/${id}`, data)

export const getComments = (id) => api.get(`/movies/getComments/${id}`)
