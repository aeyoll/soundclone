<script setup lang="ts">
import type { PropType } from 'vue';
import { computed, ref } from 'vue';
import { formatDistance } from 'date-fns';
import AudioPlayer from '@/components/AudioPlayer.vue';
import type { PlaylistSerializer } from '@/types/core';

const props = defineProps({
  playlist: { type: Object as PropType<PlaylistSerializer>, required: true },
});

const isPlaying = ref(false);
const currentSongIndex = ref(0);

const humanDate = computed(() => {
  const songDate = new Date(props.playlist?.created as string);
  return formatDistance(songDate, new Date(), { addSuffix: true });
});
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
      v-if="playlist.songs[currentSongIndex]"
      :song="playlist.songs[currentSongIndex]"
      @is-playing="isPlaying = $event"
      class="mb-4" />

    <div
      class="ml-20 border-b border-slate-900/10 py-2 slate-900 p-1"
      :class="{ 'bg-slate-100': isPlaying && currentSongIndex === index }"
      v-for="(song, index) in playlist.songs"
      :key="song.id">
      <button
        type="button"
        @click.prevent="currentSongIndex = index">
        {{ song.name }}
      </button>
    </div>
  </div>
</template>
