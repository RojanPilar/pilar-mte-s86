<template>
  <div class="card card-hover flex flex-col overflow-hidden group cursor-pointer" @click="$router.push(`/movies/${movie._id}`)">

    <!-- Card Header / Poster -->
    <div class="relative h-56 bg-gradient-to-br from-cinema-muted to-cinema-dark flex items-center justify-center overflow-hidden">

      <!-- Real poster image (shown when loaded) -->
      <img
        v-if="posterUrl && !imgError"
        :src="posterUrl"
        :alt="movie.title"
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        @error="imgError = true"
      />

      <!-- Gradient overlay on top of image -->
      <div
        v-if="posterUrl && !imgError"
        class="absolute inset-0 bg-gradient-to-t from-cinema-black/80 via-transparent to-transparent"
      ></div>

      <!-- Fallback: abstract bg + film icon (shown when no poster) -->
      <template v-else>
        <div class="absolute inset-0 opacity-20">
          <div class="absolute top-0 right-0 w-32 h-32 bg-cinema-red rounded-full blur-3xl"></div>
          <div class="absolute bottom-0 left-0 w-24 h-24 bg-cinema-gold rounded-full blur-2xl opacity-50"></div>
        </div>
        <div class="relative z-10 text-cinema-border group-hover:scale-110 transition-transform duration-300">
          <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>
          </svg>
        </div>
      </template>

      <!-- Loading shimmer -->
      <div
        v-if="posterLoading"
        class="absolute inset-0 bg-cinema-muted animate-pulse"
      ></div>

      <!-- Year badge -->
      <div class="absolute top-3 left-3 z-20">
        <span class="badge-year">{{ movie.year }}</span>
      </div>

      <!-- Genre badge -->
      <div class="absolute top-3 right-3 z-20">
        <span class="badge-genre">{{ movie.genre }}</span>
      </div>

      <!-- Hover overlay -->
      <div class="absolute inset-0 bg-cinema-red/0 group-hover:bg-cinema-red/5 transition-colors duration-300 z-10"></div>
    </div>

    <!-- Card Body -->
    <div class="flex flex-col flex-1 p-5">
      <h3 class="text-base font-bold text-cinema-text leading-tight mb-1 line-clamp-2 group-hover:text-cinema-red transition-colors duration-200">
        {{ movie.title }}
      </h3>

      <p class="text-sm text-cinema-subtle mb-3 flex items-center gap-1.5">
        <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        {{ movie.director }}
      </p>

      <p class="text-xs text-cinema-subtle leading-relaxed flex-1 line-clamp-3">
        {{ movie.description || 'No description available.' }}
      </p>

      <!-- Footer -->
      <div class="mt-4 pt-4 border-t border-cinema-border flex items-center justify-between">
        <div class="flex items-center gap-1.5 text-xs text-cinema-subtle">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {{ movie.comments?.length || 0 }} comments
        </div>
        <span class="text-xs font-medium text-cinema-red group-hover:gap-2 flex items-center gap-1 transition-all duration-200">
          View Movie
          <svg class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
})

// ─── PASTE YOUR TMDB API KEY HERE ───────────────────────────────────────────
const TMDB_API_KEY = '03f68354f66d0bad343d071861ab056c'
// ────────────────────────────────────────────────────────────────────────────

const posterUrl = ref('')
const posterLoading = ref(true)
const imgError = ref(false)

onMounted(async () => {
  if (!TMDB_API_KEY || TMDB_API_KEY === '03f68354f66d0bad343d071861ab056c') {
    posterLoading.value = false
    return
  }

  try {
    const query = encodeURIComponent(props.movie.title)
    const year  = props.movie.year ? `&year=${props.movie.year}` : ''

    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}${year}`
    )
    const data = await res.json()

    const result = data.results?.[0]
    if (result?.poster_path) {
      posterUrl.value = `https://image.tmdb.org/t/p/w500${result.poster_path}`
    }
  } catch {
    // silently fall back to placeholder
  } finally {
    posterLoading.value = false
  }
})
</script>
