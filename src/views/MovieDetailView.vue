<template>
  <div class="min-h-screen bg-cinema-black">
    <Navbar />
    <div class="pt-16">

      <!-- Loading -->
      <div v-if="loading" class="max-w-4xl mx-auto px-4 py-10">
        <LoadingSpinner message="Loading movie details..." />
      </div>

      <!-- Error -->
      <div v-else-if="errorMsg" class="max-w-4xl mx-auto px-4 py-10">
        <AlertMessage :message="errorMsg" type="error" />
        <RouterLink to="/movies" class="btn-secondary inline-flex items-center gap-2 mt-4">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to movies
        </RouterLink>
      </div>

      <!-- Movie Detail -->
      <div v-else-if="movie" class="animate-fade-in">
        <!-- Hero Banner -->
        <div class="relative overflow-hidden bg-gradient-to-b from-cinema-dark to-cinema-black py-16">
          <div class="absolute inset-0 pointer-events-none">
            <div class="absolute top-0 right-0 w-[400px] h-[400px] bg-cinema-red/8 rounded-full blur-3xl"></div>
          </div>
          <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <RouterLink to="/movies" class="inline-flex items-center gap-2 text-cinema-subtle hover:text-cinema-red text-sm transition-colors mb-8 group">
              <svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to catalog
            </RouterLink>

            <div class="flex flex-col md:flex-row gap-8">
              <!-- Poster placeholder -->
              <div class="flex-shrink-0 w-full md:w-48 h-64 md:h-72 bg-cinema-card border border-cinema-border rounded-xl flex items-center justify-center relative overflow-hidden">
                <div class="absolute inset-0">
                  <div class="absolute top-0 right-0 w-24 h-24 bg-cinema-red/20 rounded-full blur-2xl"></div>
                  <div class="absolute bottom-0 left-0 w-20 h-20 bg-cinema-gold/10 rounded-full blur-2xl"></div>
                </div>
                <svg class="w-16 h-16 text-cinema-border relative z-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>
                </svg>
              </div>

              <!-- Info -->
              <div class="flex-1">
                <div class="flex flex-wrap gap-2 mb-4">
                  <span class="badge-genre">{{ movie.genre }}</span>
                  <span class="badge-year">{{ movie.year }}</span>
                </div>
                <h1 class="text-3xl sm:text-4xl font-black text-cinema-text leading-tight mb-3">{{ movie.title }}</h1>
                <p class="text-cinema-subtle text-base mb-6 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Directed by <span class="text-cinema-text font-semibold">{{ movie.director }}</span>
                </p>

                <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                  <div class="bg-cinema-card border border-cinema-border rounded-lg p-3">
                    <p class="text-xs text-cinema-subtle mb-1">Year</p>
                    <p class="text-cinema-text font-semibold">{{ movie.year }}</p>
                  </div>
                  <div class="bg-cinema-card border border-cinema-border rounded-lg p-3">
                    <p class="text-xs text-cinema-subtle mb-1">Genre</p>
                    <p class="text-cinema-text font-semibold capitalize">{{ movie.genre }}</p>
                  </div>
                  <div class="bg-cinema-card border border-cinema-border rounded-lg p-3">
                    <p class="text-xs text-cinema-subtle mb-1">Comments</p>
                    <p class="text-cinema-text font-semibold">{{ comments.length }}</p>
                  </div>
                </div>

                <p class="text-cinema-subtle leading-relaxed">{{ movie.description || 'No description available.' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Comments Section (Stretch Goal) -->
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div class="divider mb-10"></div>

          <h2 class="section-title mb-6 flex items-center gap-2">
            <svg class="w-5 h-5 text-cinema-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Comments
            <span class="text-cinema-subtle text-base font-normal">({{ comments.length }})</span>
          </h2>

          <!-- Add Comment Form -->
          <div class="card p-6 mb-8">
            <h3 class="text-sm font-semibold text-cinema-subtle uppercase tracking-wider mb-4">Leave a comment</h3>
            <AlertMessage :message="commentError" type="error" class="mb-4" />
            <AlertMessage :message="commentSuccess" type="success" class="mb-4" />
            <textarea
              v-model.trim="newComment"
              rows="3"
              class="input-field resize-none mb-4"
              placeholder="Share your thoughts about this movie..."
            ></textarea>
            <button
              id="addComment"
              @click="handleAddComment"
              class="btn-primary flex items-center gap-2"
              :disabled="commentLoading || !newComment"
            >
              <span v-if="commentLoading" class="flex items-center gap-2">
                <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Posting...
              </span>
              <span v-else class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Post comment
              </span>
            </button>
          </div>

          <!-- Comments List -->
          <div v-if="commentsLoading" class="py-6">
            <LoadingSpinner message="Loading comments..." />
          </div>

          <div v-else-if="comments.length === 0" class="text-center py-12 card">
            <svg class="w-12 h-12 text-cinema-border mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p class="text-cinema-subtle text-sm">No comments yet. Be the first!</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="(c, idx) in comments"
              :key="idx"
              class="card p-5 flex gap-4 animate-fade-in"
            >
              <!-- Avatar -->
              <div class="w-9 h-9 rounded-full bg-cinema-muted border border-cinema-border flex items-center justify-center text-sm font-bold text-cinema-red flex-shrink-0">
                {{ (c.user || 'U').charAt(0).toUpperCase() }}
              </div>
              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-sm font-semibold text-cinema-text">{{ c.user || 'Anonymous' }}</span>
                </div>
                <p class="text-cinema-subtle text-sm leading-relaxed">{{ c.comment }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getMovie, addComment, getComments } from '../api/movies'
import Navbar from '../components/Navbar.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import AlertMessage from '../components/AlertMessage.vue'

const route = useRoute()
const movie = ref(null)
const comments = ref([])
const loading = ref(true)
const commentsLoading = ref(false)
const errorMsg = ref('')
const newComment = ref('')
const commentLoading = ref(false)
const commentError = ref('')
const commentSuccess = ref('')

async function fetchComments() {
  commentsLoading.value = true
  try {
    const res = await getComments(route.params.id)
    comments.value = res.data.comments || res.data || []
  } catch {
    comments.value = movie.value?.comments || []
  } finally {
    commentsLoading.value = false
  }
}

async function handleAddComment() {
  commentError.value = ''
  commentSuccess.value = ''
  if (!newComment.value.trim()) {
    commentError.value = 'Comment cannot be empty.'
    return
  }
  commentLoading.value = true
  try {
    await addComment(route.params.id, { comment: newComment.value.trim() })
    commentSuccess.value = 'Comment posted!'
    newComment.value = ''
    await fetchComments()
    setTimeout(() => (commentSuccess.value = ''), 3000)
  } catch (err) {
    commentError.value = err.response?.data?.message || 'Failed to post comment.'
  } finally {
    commentLoading.value = false
  }
}

onMounted(async () => {
  try {
    const res = await getMovie(route.params.id)
    movie.value = res.data.movie || res.data || null
    comments.value = movie.value?.comments || []
    await fetchComments()
  } catch {
    errorMsg.value = 'Movie not found or failed to load.'
  } finally {
    loading.value = false
  }
})
</script>
