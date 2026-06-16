<template>
  <div class="min-h-screen bg-cinema-black">
    <!-- Navbar Component -->
    <Navbar />
    
    <div class="pt-16">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <!-- Header Links and Info Panels -->
        <div class="mb-8">
          <RouterLink to="/movies" class="inline-flex items-center gap-2 text-cinema-subtle hover:text-cinema-red text-sm transition-colors mb-6 group">
            <svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to catalog
          </RouterLink>

          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 bg-cinema-red/20 border border-cinema-red/30 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-cinema-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p class="text-cinema-red text-xs font-bold uppercase tracking-widest">Admin Panel</p>
              <h1 class="text-3xl font-black text-cinema-text">Add New Movie</h1>
            </div>
          </div>
          <p class="text-cinema-subtle">Fill in the details below to add a movie to the catalog.</p>
        </div>

        <!-- Form Card Container -->
        <div class="card p-8 border border-cinema-border bg-cinema-black/40 rounded-xl shadow-xl">
          <AlertMessage :message="errorMsg" type="error" class="mb-6" />
          <AlertMessage :message="successMsg" type="success" class="mb-6" />

          <form @submit.prevent="handleAddMovie" novalidate class="space-y-6">
            <!-- Title Input Area -->
            <div>
              <label class="label-text block mb-2 text-sm font-medium text-cinema-text" for="title">Movie title <span class="text-cinema-red">*</span></label>
              <input
                id="title"
                v-model.trim="form.title"
                type="text"
                class="input-field w-full px-4 py-2 bg-cinema-muted border border-cinema-border rounded-lg text-cinema-text focus:outline-none focus:border-cinema-red transition-colors"
                placeholder="e.g. The Dark Knight"
                required
              />
            </div>

            <!-- Director Input Area -->
            <div>
              <label class="label-text block mb-2 text-sm font-medium text-cinema-text" for="director">Director <span class="text-cinema-red">*</span></label>
              <input
                id="director"
                v-model.trim="form.director"
                type="text"
                class="input-field w-full px-4 py-2 bg-cinema-muted border border-cinema-border rounded-lg text-cinema-text focus:outline-none focus:border-cinema-red transition-colors"
                placeholder="e.g. Christopher Nolan"
                required
              />
            </div>

            <!-- Year & Genre Inputs (Responsive Grid Setup) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label class="label-text block mb-2 text-sm font-medium text-cinema-text" for="year">Release year <span class="text-cinema-red">*</span></label>
                <input
                  id="year"
                  v-model.number="form.year"
                  type="number"
                  class="input-field w-full px-4 py-2 bg-cinema-muted border border-cinema-border rounded-lg text-cinema-text focus:outline-none focus:border-cinema-red transition-colors"
                  placeholder="e.g. 2024"
                  min="1888"
                  :max="maxCalculatedYear"
                  required
                />
              </div>
              <div>
                <label class="label-text block mb-2 text-sm font-medium text-cinema-text" for="genre">Genre <span class="text-cinema-red">*</span></label>
                <input
                  id="genre"
                  v-model.trim="form.genre"
                  type="text"
                  class="input-field w-full px-4 py-2 bg-cinema-muted border border-cinema-border rounded-lg text-cinema-text focus:outline-none focus:border-cinema-red transition-colors"
                  placeholder="e.g. Action, Drama, Sci-Fi"
                  required
                />
              </div>
            </div>

            <!-- Description Text Area -->
            <div>
              <label class="label-text block mb-2 text-sm font-medium text-cinema-text" for="description">Description <span class="text-cinema-red">*</span></label>
              <textarea
                id="description"
                v-model.trim="form.description"
                rows="5"
                class="input-field w-full px-4 py-2 bg-cinema-muted border border-cinema-border rounded-lg text-cinema-text focus:outline-none focus:border-cinema-red transition-colors resize-none"
                placeholder="Write a brief synopsis or overview of the movie..."
                required
              ></textarea>
              <p class="text-xs text-cinema-subtle mt-1">{{ form.description.length }} characters</p>
            </div>

            <!-- Form Form Submission Actions -->
            <div class="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                class="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-cinema-red text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all shadow-lg shadow-cinema-red/20"
                :disabled="loading"
              >
                <span v-if="loading" class="flex items-center gap-2">
                  <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Adding movie...
                </span>
                <span v-else class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add movie to catalog
                </span>
              </button>
              <button 
                type="button" 
                @click="resetForm" 
                class="px-6 py-2.5 bg-cinema-muted border border-cinema-border text-cinema-text rounded-lg hover:bg-cinema-border transition-colors sm:w-32"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        <!-- Live Preview Card Rendering -->
        <div v-if="form.title || form.director" class="mt-6">
          <p class="text-xs text-cinema-subtle uppercase tracking-widest font-semibold mb-3">Preview</p>
          <div class="card p-5 border border-dashed border-cinema-border/50 bg-cinema-black/20 rounded-xl">
            <div class="flex flex-wrap gap-2 mb-2">
              <span v-if="form.genre" class="px-2 py-0.5 text-xs font-semibold bg-cinema-muted text-cinema-text rounded">{{ form.genre }}</span>
              <span v-if="form.year" class="px-2 py-0.5 text-xs font-semibold bg-cinema-red/10 text-cinema-red rounded">{{ form.year }}</span>
            </div>
            <h3 class="text-lg font-bold text-cinema-text mb-1">{{ form.title || 'Movie Title' }}</h3>
            <p class="text-sm text-cinema-subtle mb-2">{{ form.director ? `Directed by ${form.director}` : 'Director' }}</p>
            <p class="text-xs text-cinema-subtle leading-relaxed line-clamp-3">{{ form.description || 'Description will appear here...' }}</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { addMovie } from '../api/movies'
import Navbar from '../components/Navbar.vue'
import AlertMessage from '../components/AlertMessage.vue'

const router = useRouter()
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

// Compute maximum allowable date safely for layout bindings
const maxCalculatedYear = computed(() => new Date().getFullYear() + 2)

const defaultForm = () => ({
  title: '',
  director: '',
  year: new Date().getFullYear(),
  description: '',
  genre: '',
})

const form = ref(defaultForm())

function resetForm() {
  form.value = defaultForm()
  errorMsg.value = ''
  successMsg.value = ''
}

async function handleAddMovie() {
  errorMsg.value = ''
  successMsg.value = ''

  const { title, director, year, description, genre } = form.value
  if (!title || !director || !year || !description || !genre) {
    errorMsg.value = 'All fields are required.'
    return
  }
  if (year < 1888 || year > maxCalculatedYear.value) {
    errorMsg.value = 'Please enter a valid release year.'
    return
  }

  loading.value = true
  try {
    await addMovie({ title, director, year, description, genre })
    successMsg.value = `"${title}" has been added to the catalog! Redirecting...`
    setTimeout(() => router.push('/movies'), 1800)
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Failed to add movie. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
