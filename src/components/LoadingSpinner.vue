<template>
  <div class="flex flex-col items-center justify-center py-20 gap-4">
    <div class="relative w-12 h-12">
      <div class="absolute inset-0 rounded-full border-2 border-cinema-border"></div>
      <div class="absolute inset-0 rounded-full border-2 border-t-cinema-red animate-spin"></div>
    </div>
    <p class="text-cinema-subtle text-sm animate-pulse">{{ message || 'Loading...' }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: String,
})
</script>
