<template>
  <div class="min-h-screen bg-cinema-black text-white">
    <!-- Navbar Component standard placement -->
    <Navbar />
    
    <!-- Router View container where pages render -->
    <main class="pt-16">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
// Bypasses shortcuts to point explicitly to your components folder
import Navbar from './components/Navbar.vue' 
</script>

<style>
/* Global dark base theme normalization rules */
body {
  @apply bg-cinema-black text-cinema-text antialiased;
  background-color: #0b0c10;
}
</style>
