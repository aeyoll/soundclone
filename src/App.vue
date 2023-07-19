<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navigation from '@/components/MainNavigation.vue';
</script>

<template>
  <header>
    <div class="wrapper">
      <Navigation></Navigation>
    </div>
  </header>

  <RouterView />
</template>
