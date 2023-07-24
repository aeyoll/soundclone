<script setup lang="ts">
import type { SongSerializer } from '@/types/core';
import type { PropType } from 'vue';
import { computed, onMounted } from 'vue';
import { formatDistance } from 'date-fns';
import SongPlayer from '@/components/SongPlayer.vue';

const props = defineProps({
  song: { type: Object as PropType<SongSerializer>, required: true }
});

const humanDate = computed(() => {
  return formatDistance(new Date(props.song?.created as string), new Date(), { addSuffix: true });
});

onMounted(() => {
})
</script>

<template>
  <div class="py-2 border-b border-slate-900/10 text-sm">
    <div class="flex items-center justify-between mb-4">
      {{ song.name }}

      <div class="text-slate-500 text-xs">
        {{ humanDate }}
      </div>
    </div>

    <SongPlayer :song="song"></SongPlayer>
  </div>
</template>
