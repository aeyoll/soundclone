import { defineStore } from 'pinia';
import type { Ref } from 'vue';
import {
  computed, inject, ref,
} from 'vue';

import type { PlaylistSerializer, SongSerializer } from '@/types/core';
import { removeObjectWithId } from '@/utils';

export interface SongPayload {
  name: string,
  file: File | undefined,
  playlist: number | undefined,
}

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

  const updateSong = async (songId: number, song: SongPayload) => {
    try {
      const { data } = await axios.patch(`songs/${songId}/`, song);

      // Update song in playlists
      playlists.value = playlists.value.map((playlist) => {
        if (!playlist.songs) {
          return playlist;
        }

        const index = (playlist.songs).findIndex((s) => s.id === songId);

        if (index > -1) {
          const newPlaylist = { ...playlist };
          // @ts-ignore
          newPlaylist.songs = newPlaylist.songs.map((s) => (s.id === songId ? data : s));
          return newPlaylist;
        }

        return playlist;
      });

      // Update song
      const index = songs.value.findIndex((s) => s.id === songId);

      if (index > -1) {
        songs.value[index] = data;
      }
    } catch (e) {
      console.log(e);
      // @TODO: handle error
    }
  };

  const deleteSong = async (songId: number) => {
    try {
      await axios.delete(`songs/${songId}/`);
      playlists.value = playlists.value.map((playlist) => {
        if (!playlist.songs) {
          return playlist;
        }

        const index = playlist.songs.findIndex((s) => s.id === songId);

        if (index > -1 && playlist.songs?.length) {
          const newPlaylist = { ...playlist };
          newPlaylist.songs = removeObjectWithId(playlist.songs, songId);
          return newPlaylist;
        }

        return playlist;
      });

      songs.value = removeObjectWithId(songs.value, songId);
    } catch (e) {
      console.log(e);
      // @TODO: handle error
    }
  };

  const deletePlaylist = async (playlistId: number) => {
    try {
      await axios.delete(`playlists/${playlistId}/`);
      playlists.value = removeObjectWithId(playlists.value, playlistId);
    } catch (e) {
      // @TODO: handle error
    }
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
    updateSong,
    deleteSong,
    deletePlaylist,
    getFeed,
    setCurrentIndex,
    goToNextSong,
  };
});
