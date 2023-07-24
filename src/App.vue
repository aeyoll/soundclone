<script setup lang="ts">
import { RouterView } from 'vue-router';
import MainNavigation from '@/components/AppNavigation.vue';
</script>

<template>
  <header>
    <MainNavigation />
  </header>

  <div class="container mx-auto my-4">
    <RouterView />
  </div>
</template>
