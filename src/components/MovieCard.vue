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
  // Safe validation check without forcing an accidental early return block
  if (!TMDB_API_KEY || TMDB_API_KEY.trim() === '') {
    console.warn('TMDB API Key missing.')
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

    // Extract the primary listing matching your data catalog criteria
    const result = data.results?.[0]
    if (result && result.poster_path) {
      posterUrl.value = `https://image.tmdb.org/t/p/w500${result.poster_path}`
    } else {
      // Secondary fallback check trying a broader search if year parameter returned zero hits
      const broadRes = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}`
      )
      const broadData = await broadRes.json()
      const broadResult = broadData.results?.[0]
      if (broadResult && broadResult.poster_path) {
        posterUrl.value = `https://image.tmdb.org/t/p/w500${broadResult.poster_path}`
      }
    }
  } catch (err) {
    console.error('TMDB API query execution failed:', err)
  } finally {
    posterLoading.value = false
  }
})
</script>
