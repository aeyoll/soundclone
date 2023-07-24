<script setup lang="ts">
import type { PropType } from 'vue';
import { computed } from 'vue';
import { formatDistance } from 'date-fns';
import AudioPlayer from '@/components/AudioPlayer.vue';
import type { SongSerializer } from '@/types/core';

const props = defineProps({
  song: { type: Object as PropType<SongSerializer>, required: true },
});

const humanDate = computed(() => {
  const songDate = new Date(props.song?.created as string);
  return formatDistance(songDate, new Date(), { addSuffix: true });
});
</script>

<template>
  <div class="py-4 border-b border-slate-900/10 text-sm">
    <div class="flex items-center justify-between mb-4">
      {{ song.name }}

      <div class="text-slate-500 text-xs">
        {{ humanDate }}
      </div>
    </div>

    <AudioPlayer :song="song" />
  </div>
</template>
