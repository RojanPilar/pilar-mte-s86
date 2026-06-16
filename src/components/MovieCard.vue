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
    console.warn('TMDB API Key missing.')
    posterLoading.value = false
    return
  }

  try {
    const query = encodeURIComponent(props.movie.title)
    const year  = props.movie.year ? `&year=${props.movie.year}` : ''

    // 1. First attempt: Search matching both Title and Year
    const res = await fetch(
      `https://themoviedb.org{TMDB_API_KEY}&query=${query}${year}`
    )
    const data = await res.json()

    // FIXED: Correctly grab the first item [0] from the results array
    const result = data.results && data.results.length > 0 ? data.results[0] : null
    
    if (result && result.poster_path) {
      posterUrl.value = `https://tmdb.org{result.poster_path}`
    } else {
      // 2. Fallback attempt: Broader search by Title only (ignores mismatched years)
      const broadRes = await fetch(
        `https://themoviedb.org{TMDB_API_KEY}&query=${query}`
      )
      const broadData = await broadRes.json()
      
      // FIXED: Correctly grab the first item [0] from the fallback results array
      const broadResult = broadData.results && broadData.results.length > 0 ? broadData.results[0] : null
      if (broadResult && broadResult.poster_path) {
        posterUrl.value = `https://tmdb.org{broadResult.poster_path}`
      }
    }
  } catch (err) {
    console.error('TMDB API Error:', err)
    imgError.value = true
  } finally {
    posterLoading.value = false
  }
})
</script>
