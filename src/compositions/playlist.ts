import { inject, ref } from 'vue';

import type { PlaylistSerializer } from '@/types/core';

export default function usePlaylist() {
  const axios: any = inject('axios');

  const playlist = ref<PlaylistSerializer|null>(null);
  const newPlaylistName = ref<string>('');

  async function createPlaylist(): Promise<void> {
    try {
      const payload = {
        name: newPlaylistName.value,
      };

      const { data } = await axios.post('playlists/', payload);
      playlist.value = data;
    } catch (e) {
    // @TODO: handle error
    }
  }

  return { playlist, newPlaylistName, createPlaylist };
}
