<script setup lang="ts">
import type { PropType } from 'vue';
import { computed } from 'vue';
import { formatDistance } from 'date-fns';
import AudioPlayer from '@/components/AudioPlayer.vue';
import AppButton from '@/components/AppButton.vue';
import { useSoundcloneStore } from '@/stores/soundclone.ts';
import type { SongSerializer } from '@/types/core';

const store = useSoundcloneStore();

const props = defineProps({
  song: { type: Object as PropType<SongSerializer>, required: true },
  index: { type: Number, required: true },
});

const humanDate = computed(() => {
  const songDate = new Date(props.song?.created as string);
  return formatDistance(songDate, new Date(), { addSuffix: true });
});

const deleteSong = () => {
  store.deleteSong(props.song?.id as number);
};
</script>

<template>
  <div class="py-4 border-b border-slate-900/10 text-sm">
    <div class="flex items-center justify-between mb-4">
      <RouterLink
        :to="{
          name: 'song',
          params: { id: song.id },
        }">
        {{ song.name }}
      </RouterLink>

      <div class="text-slate-500 text-xs">
        {{ humanDate }}
      </div>
    </div>

    <AudioPlayer :song="song" :index="index" />

    <div class="flex gap-2 mt-4">
      <AppButton type="button" size="xs">Edit</AppButton>
      <AppButton type="button" size="xs" @click.prevent="deleteSong()">Delete</AppButton>
    </div>
  </div>
</template>
