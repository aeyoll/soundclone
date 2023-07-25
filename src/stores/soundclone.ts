import type { Ref } from 'vue';
import { computed, inject, ref } from 'vue';
import { defineStore } from 'pinia';
import type { PlaylistSerializer, SongSerializer } from '@/types/core';

// eslint-disable-next-line import/prefer-default-export
export const useSoundcloneStore = defineStore('soundclone', () => {
  // Data
  const playlists: Ref<PlaylistSerializer[]> = ref([]);
  const songs: Ref<SongSerializer[]> = ref([]);
  const currentIndex = ref(0);

  // Computed
  const feed = computed(() => {
    const merged = [...songs.value, ...playlists.value];
    // @ts-ignore
    return merged.sort((a, b) => new Date(b.created!) - new Date(a.created!));
  });

  // Injection
  const axios: any = inject('axios');

  // Methods
  const getPlaylists = async () => {
    const { data } = await axios.get('playlists/');
    playlists.value = data;
  };

  const getSongs = async () => {
    const { data } = await axios.get('songs/');
    songs.value = data;
  };

  const getFeed = async () => {
    await Promise.all([
      getSongs(),
      getPlaylists(),
    ]);
  };

  const setCurrentIndex = (index: number) => {
    currentIndex.value = index;
  };

  const goToNextSong = () => {
    if (currentIndex.value < feed.value.length - 1) {
      currentIndex.value += 1;
    } else {
      currentIndex.value = 0;
    }
  };

  return {
    playlists,
    songs,
    feed,
    currentIndex,
    getPlaylists,
    getSongs,
    getFeed,
    setCurrentIndex,
    goToNextSong,
  };
});
