<script setup lang="ts">
import {
  computed, inject, onMounted, Ref, ref,
} from 'vue';
import ViewTitle from '@/components/AppTitle.vue';
import FeedSong from '@/components/FeedSong.vue';
import type { PlaylistSerializer, SongSerializer } from '@/types/core';

// Injections
const axios: any = inject('axios');

// Data
const playlists: Ref<PlaylistSerializer[]> = ref([]);
const songs: Ref<SongSerializer[]> = ref([]);

// Methods
const getPlaylists = async () => {
  const { data } = await axios.get('playlists/');
  playlists.value = data;
};

const getSongs = async () => {
  const { data } = await axios.get('songs/');
  songs.value = data;
};

// Computed
const feed = computed(() => {
  const merged = [...songs.value, ...playlists.value];
  return merged.sort((a, b) => new Date(b.created!) - new Date(a.created!));
});

onMounted(async () => {
  await Promise.all([getSongs(), getPlaylists()]);
});
</script>

<template>
  <main>
    <ViewTitle>Feed</ViewTitle>

    <div v-if="feed.length > 0" class="lg:w-2/3">
      <div v-for="item in feed" :key="item.id">
        <div v-if="item.hasOwnProperty('songs')">
          {{ item.name }}

          <div v-for="song in item.songs" :key="song.id">
            {{ song.name }}
          </div>
        </div>

        <div v-else>
          <FeedSong :song="item as SongSerializer" />
        </div>
      </div>
    </div>
    <div v-else class="alert alert-danger">
      No feed
    </div>
  </main>
</template>
