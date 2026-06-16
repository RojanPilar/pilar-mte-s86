<template>
  <Transition name="slide-fade">
    <div
      v-if="message"
      :class="[
        'flex items-start gap-3 px-4 py-3 rounded-lg border text-sm font-medium',
        type === 'error'
          ? 'bg-cinema-red/10 border-cinema-red/30 text-cinema-red'
          : 'bg-green-500/10 border-green-500/30 text-green-400'
      ]"
    >
      <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path v-if="type === 'error'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {{ message }}
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  message: String,
  type: {
    type: String,
    default: 'error',
  },
})
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
