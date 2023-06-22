<script setup lang="ts">
import { inject, onMounted, Ref, ref } from 'vue';
import type { AlbumSerializer } from '../../types/core';

const axios: any = inject('axios');
const albums: Ref<AlbumSerializer[]> = ref([]);

onMounted(async () => {
  const { data } = await axios.get('albums/');
  albums.value = data;
});
</script>

<template>
  <main>
    <h1>This is the home page</h1>

    <div v-for="album in albums" :key="album.id">
      {{ album.name }}

      <div v-for="song in album.songs" :key="song.id">
        {{ song.name }}
      </div>
    </div>
  </main>
</template>
