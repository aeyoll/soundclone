<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="px-8 py-4 border-b border-slate-900/10">
    <div class="relative flex items-center text-sm leading-6 font-semibold text-slate-800">
      <RouterLink to="/">Soundclone</RouterLink>

      <nav class="ml-auto">
        <ul class="flex space-x-8">
          <li><RouterLink class="" to="/upload">Upload</RouterLink></li>
          <li><RouterLink class="" to="/about">About</RouterLink></li>
        </ul>
      </nav>
    </div>
  </div>
</template>
