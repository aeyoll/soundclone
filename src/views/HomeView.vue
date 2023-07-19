<script setup lang="ts">
import { inject, onMounted, Ref, ref } from 'vue';
import type { PlaylistSerializer, SongSerializer } from '@/types/core';

const axios: any = inject('axios');
const playlists: Ref<PlaylistSerializer[]> = ref([]);

const songs: Ref<SongSerializer[]> = ref([]);

const getPlaylists = async () => {
  const { data } = await axios.get('playlists/');
  playlists.value = data;
};

const getSongs = async () => {
  const { data } = await axios.get('songs/');
  songs.value = data;
}

onMounted(async () => {
  await Promise.all([getSongs(), getPlaylists()]);
});
</script>

<template>
  <main>
    <h1>Playlists</h1>

    <div v-if="playlists.length > 0" >
      <div v-for="playlist in playlists" :key="playlist.id">
        {{ playlist.name }}

        <div v-for="song in playlist.songs" :key="song.id">
          {{ song.name }}
        </div>
      </div>
    </div>

    <div v-else class="alert alert-danger">
      No playlist
    </div>

    <h1>Songs</h1>

    <div v-if="songs.length > 0" >
      <div v-for="song in songs" :key="song.id">
        {{ song.name }}
      </div>
    </div>

    <div v-else class="alert alert-danger">
      No songs
    </div>
  </main>
</template>
