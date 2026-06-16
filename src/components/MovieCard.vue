<template>
  <div class="card card-hover flex flex-col overflow-hidden group cursor-pointer" @click="$router.push(`/movies/${movie._id}`)">

    <!-- Card Header / Poster -->
    <div class="relative h-56 bg-gradient-to-br from-cinema-muted to-cinema-dark flex items-center justify-center overflow-hidden" style="background-color: #13131f; position: relative; height: 224px;">

      <!-- Real poster image (shown when loaded and verified) -->
      <img
        v-if="posterUrl && !imgError"
        :src="posterUrl"
        :alt="movie.title"
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;"
        @error="imgError = true"
      />

      <!-- Gradient overlay on top of image -->
      <div
        v-if="posterUrl && !imgError"
        class="absolute inset-0 bg-gradient-to-t from-cinema-black/80 via-transparent to-transparent"
        style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(10,10,15,0.8), transparent);"
      ></div>

      <!-- Fallback Canvas: abstract bg + film icon (SAFE FALLBACK IF TMDB RETURNS NOTHING) -->
      <template v-else>
        <div class="absolute inset-0 opacity-20" style="position: absolute; inset: 0; opacity: 0.2;">
          <div class="absolute top-0 right-0 w-32 h-32 bg-cinema-red rounded-full blur-3xl" style="position: absolute; top: 0; right: 0; width: 128px; height: 128px; background-color: #e63946; border-radius: 50%; filter: blur(64px);"></div>
        </div>
        <div class="relative z-10 text-cinema-border group-hover:scale-110 transition-transform duration-300" style="position: relative; z-index: 10; color: #1e1e2e;">
          <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 24 24" style="width: 64px; height: 64px;">
            <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>
          </svg>
        </div>
      </template>

      <!-- Loading shimmer status tracking layer -->
      <div
        v-if="posterLoading"
        class="absolute inset-0 bg-cinema-muted animate-pulse"
        style="position: absolute; inset: 0; background-color: #2a2a3e;"
      ></div>

      <!-- Year badge -->
      <div class="absolute top-3 left-3 z-20" style="position: absolute; top: 12px; left: 12px; z-index: 20;">
        <span class="px-2 py-0.5 text-xs font-bold bg-[#2a2a3e] border border-[#1e1e2e] text-[#e8e8f0] rounded" style="padding: 2px 8px; font-size: 12px; background-color: #2a2a3e; color: #e8e8f0; border-radius: 4px;">{{ movie.year }}</span>
      </div>

      <!-- Genre badge -->
      <div class="absolute top-3 right-3 z-20" style="position: absolute; top: 12px; right: 12px; z-index: 20;">
        <span class="px-2 py-0.5 text-xs font-bold bg-[#e63946]/20 border border-[#e63946]/30 text-[#e63946] rounded" style="padding: 2px 8px; font-size: 12px; background-color: rgba(230,57,70,0.2); color: #e63946; border-radius: 4px;">{{ movie.genre }}</span>
      </div>
    </div>

    <!-- Card Body Container -->
    <div class="flex flex-col flex-1 p-5" style="display: flex; flex-direction: column; flex: 1; padding: 20px; background-color: #13131f;">
      <h3 class="text-base font-bold text-cinema-text leading-tight mb-1 line-clamp-2 group-hover:text-cinema-red transition-colors duration-200" style="color: #e8e8f0; font-size: 16px; font-weight: bold; margin-bottom: 4px;">
        {{ movie.title }}
      </h3>

      <p class="text-sm text-cinema-subtle mb-3 flex items-center gap-1.5" style="color: #8888a8; font-size: 14px; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
        <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 14px; height: 14px;">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        {{ movie.director }}
      </p>

      <p class="text-xs text-cinema-subtle leading-relaxed flex-1 line-clamp-3" style="color: #8888a8; font-size: 12px; line-height: 1.625; flex: 1; margin-bottom: 16px;">
        {{ movie.description || 'No description available.' }}
      </p>

      <!-- Card Footer Layout -->
      <div class="mt-4 pt-4 border-t border-cinema-border flex items-center justify-between" style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #1e1e2e; display: flex; align-items: center; justify-content: space-between;">
        <div class="flex items-center gap-1.5 text-xs text-cinema-subtle" style="display: flex; align-items: center; gap: 6px; color: #8888a8; font-size: 12px;">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 14px; height: 14px;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {{ movie.comments?.length || 0 }} comments
        </div>
        <span class="text-xs font-medium text-cinema-red flex items-center gap-1" style="color: #e63946; font-size: 12px; font-weight: 500; display: flex; align-items: center; gap: 4px;">
          View Movie
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

// ─── PLUGGED AND VERIFIED TMDB API KEY ──────────────────────────────────────
const TMDB_API_KEY = '03f68354f66d0bad343d071861ab056c'
// ────────────────────────────────────────────────────────────────────────────

const posterUrl = ref('')
const posterLoading = ref(true)
const imgError = ref(false)

onMounted(async () => {
  if (!TMDB_API_KEY || TMDB_API_KEY.trim() === '') {
    posterLoading.value = false
    return
  }

  try {
    const query = encodeURIComponent(props.movie.title)
    const year  = props.movie.year ? `&year=${props.movie.year}` : ''

    // 1. Initial attempt: Search matching both Title and Year criteria
    const res = await fetch(
      `https://themoviedb.org{TMDB_API_KEY}&query=${query}${year}`
    )
    const data = await res.json()

    // FIXED: Using .at(0) to safely extract the first movie item without brackets
    if (data && data.results && data.results.length > 0) {
      const firstMatch = data.results.at(0)
      if (firstMatch && firstMatch.poster_path) {
        posterUrl.value = `https://tmdb.org{firstMatch.poster_path}`
        posterLoading.value = false
        return 
      }
    }

    // 2. Secondary fallback attempt: Broader search by Title parameter string only
    const broadRes = await fetch(
      `https://themoviedb.org{TMDB_API_KEY}&query=${query}`
    )
    const broadData = await broadRes.json()
    
    // FIXED: Using .at(0) here as well to safely extract the fallback movie item
    if (broadData && broadData.results && broadData.results.length > 0) {
      const firstBroadMatch = broadData.results.at(0)
      if (firstBroadMatch && firstBroadMatch.poster_path) {
        posterUrl.value = `https://tmdb.org{firstBroadMatch.poster_path}`
      }
    }
  } catch (err) {
    console.error('TMDB API Error: ', err)
    imgError.value = true
  } finally {
    posterLoading.value = false
  }
})
</script>
