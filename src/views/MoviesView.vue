<template>
  <div class="min-h-screen bg-cinema-black">
    <Navbar />

    <!-- Hero Section -->
    <div class="pt-16">
      <div class="relative overflow-hidden bg-hero-gradient">
        <div class="absolute inset-0 pointer-events-none">
          <div class="absolute top-0 right-0 w-[500px] h-[300px] bg-cinema-red/8 rounded-full blur-3xl"></div>
          <div class="absolute bottom-0 left-0 w-64 h-64 bg-cinema-gold/5 rounded-full blur-3xl"></div>
        </div>
        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div class="max-w-2xl">
            <p class="text-cinema-red text-sm font-semibold tracking-widest uppercase mb-3">Movie Catalog</p>
            <h1 class="text-4xl sm:text-5xl font-black text-cinema-text leading-tight mb-4">
              Discover your next<br />
              <span class="text-gradient">favorite film.</span>
            </h1>
            <p class="text-cinema-subtle text-lg">
              Browse our curated collection of movies. Click any title to read more and leave a comment.
            </p>
          </div>

          <!-- Stats row -->
          <div class="flex items-center gap-6 mt-8" v-if="!loading">
            <div class="text-center">
              <div class="text-2xl font-bold text-cinema-text">{{ movies.length }}</div>
              <div class="text-xs text-cinema-subtle">Total Movies</div>
            </div>
            <div class="w-px h-10 bg-cinema-border"></div>
            <div class="text-center">
              <div class="text-2xl font-bold text-cinema-text">{{ uniqueGenres }}</div>
              <div class="text-xs text-cinema-subtle">Genres</div>
            </div>
            <div class="w-px h-10 bg-cinema-border"></div>
            <div class="text-center">
              <div class="text-2xl font-bold text-cinema-text">{{ totalComments }}</div>
              <div class="text-xs text-cinema-subtle">Comments</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <!-- Search & Filter Bar -->
      <div class="flex flex-col sm:flex-row gap-3 mb-8">
        <div class="relative flex-1">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cinema-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search by title, director, or genre..."
            class="input-field pl-10"
          />
        </div>
        <select v-model="selectedGenre" class="input-field sm:w-44">
          <option value="">All genres</option>
          <option v-for="genre in genreList" :key="genre" :value="genre">{{ genre }}</option>
        </select>
      </div>

      <!-- Loading -->
      <LoadingSpinner v-if="loading" message="Fetching movies..." />

      <!-- Error -->
      <AlertMessage v-else-if="errorMsg" :message="errorMsg" type="error" />

      <!-- Empty State -->
      <div v-else-if="filteredMovies.length === 0" class="text-center py-20">
        <div class="w-20 h-20 bg-cinema-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-cinema-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
        </div>
        <h3 class="text-cinema-text font-semibold text-lg mb-1">No movies found</h3>
        <p class="text-cinema-subtle text-sm">Try adjusting your search or filter.</p>
        <button @click="clearFilters" class="btn-outline mt-4 text-sm px-4 py-2">Clear filters</button>
      </div>

      <!-- Movie Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-fade-in">
        <MovieCard
          v-for="movie in filteredMovies"
          :key="movie._id"
          :movie="movie"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getMovies } from '../api/movies'
import Navbar from '../components/Navbar.vue'
import MovieCard from '../components/MovieCard.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import AlertMessage from '../components/AlertMessage.vue'

const movies = ref([])
const loading = ref(true)
const errorMsg = ref('')
const searchQuery = ref('')
const selectedGenre = ref('')

const uniqueGenres = computed(() => new Set(movies.value.map(m => m.genre).filter(Boolean)).size)
const totalComments = computed(() => movies.value.reduce((acc, m) => acc + (m.comments?.length || 0), 0))

const genreList = computed(() => {
  const genres = [...new Set(movies.value.map(m => m.genre).filter(Boolean))]
  return genres.sort()
})

const filteredMovies = computed(() => {
  let list = movies.value
  const q = searchQuery.value.toLowerCase().trim()
  if (q) {
    list = list.filter(m =>
      m.title?.toLowerCase().includes(q) ||
      m.director?.toLowerCase().includes(q) ||
      m.genre?.toLowerCase().includes(q)
    )
  }
  if (selectedGenre.value) {
    list = list.filter(m => m.genre === selectedGenre.value)
  }
  return list
})

function clearFilters() {
  searchQuery.value = ''
  selectedGenre.value = ''
}

onMounted(async () => {
  try {
    const res = await getMovies()
    movies.value = res.data.movies || res.data || []
  } catch (err) {
    errorMsg.value = 'Failed to load movies. Please try again later.'
  } finally {
    loading.value = false
  }
})
</script>
