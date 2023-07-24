<script setup lang="ts">
import { RouterView } from 'vue-router'
import MainNavigation from '@/components/MainNavigation.vue';
</script>

<template>
  <header>
    <MainNavigation></MainNavigation>
  </header>

  <div class="container mx-auto my-4">
    <RouterView />
  </div>
</template>
