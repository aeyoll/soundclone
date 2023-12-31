<script setup lang="ts">
import type { PropType } from 'vue';
import { computed, ref } from 'vue';

import AppButton from '@/components/AppButton.vue';
import AppWarning from '@/components/AppWarning.vue';
import AudioPlayer from '@/components/AudioPlayer.vue';
import { useSoundcloneStore } from '@/stores/soundclone';
import type { PlaylistSerializer } from '@/types/core';
import { formatHumanDate } from '@/utils';

const store = useSoundcloneStore();

const props = defineProps({
  playlist: { type: Object as PropType<PlaylistSerializer>, required: true },
  index: { type: Number, required: true },
});

const isPlaying = ref(false);
const currentSongIndex = ref(0);

const humanDate = computed(() => formatHumanDate(props.playlist?.created as string));
const playlistLength = computed(() => ((props.playlist?.songs) ? props.playlist?.songs.length : 0));
const isLastSongPlaying = computed(() => currentSongIndex.value === playlistLength.value - 1);

const goToNextSong = () => {
  if (isLastSongPlaying.value) {
    // If the last song of the playlist is playing, go to the next
    // item in the feed
    store.goToNextSong();
  } else {
    // Otherwise, go to the next song in the playlist
    currentSongIndex.value += 1;
  }
};

const deletePlaylist = () => {
  store.deletePlaylist(props.playlist?.id as number);
};
</script>

<template>
  <div class="py-4 border-b border-slate-900/10 text-sm">
    <div class="flex items-center justify-between mb-4">
      {{ playlist.name }}

      <div class="text-slate-500 text-xs">
        {{ humanDate }}
      </div>
    </div>

    <AudioPlayer
      v-if="playlist.songs && playlist.songs[currentSongIndex]"
      :song="playlist.songs[currentSongIndex]"
      :playlist="playlist"
      :index="index"
      @is-playing="isPlaying = $event"
      @song-finished="goToNextSong()"
      class="mb-4" />

    <div class="ml-20 border border-slate-200 rounded text-sm" v-if="playlist.songs?.length > 0">
      <button
        class="p-2 w-full text-left flex justify-between items-center"
        :class="{ 'border-b': index !== playlist.songs?.length - 1, 'bg-slate-100': isPlaying && currentSongIndex === index }"
        v-for="(song, index) in playlist.songs"
        :key="song.id"
        type="button"
        @click.prevent="currentSongIndex = index">
        {{ song.name }}
        <span class="text-xs text-slate-500">
          {{ formatHumanDate(song.created as string) }}
        </span>
      </button>
    </div>
    <AppWarning v-else>
      No song in the playlist
    </AppWarning>

    <div class="flex justify-end gap-2 mt-4" v-if="playlist.songs">
      <div v-if="playlist.songs.length > 1">
        <AppButton size="xs" :disabled="currentSongIndex === 0" @click.prevent="currentSongIndex -= 1">Prev</AppButton>
        <AppButton size="xs" :disabled="currentSongIndex === playlist.songs.length - 1" @click.prevent="currentSongIndex += 1">Next</AppButton>
      </div>
      <AppButton size="xs">Edit</AppButton>
      <AppButton size="xs" @click.prevent="deletePlaylist()">Delete</AppButton>
    </div>
  </div>
</template>
