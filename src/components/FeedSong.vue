<script setup lang="ts">
import type { PropType } from 'vue';
import { computed, ref } from 'vue';

import AppButton from '@/components/AppButton.vue';
import AppModal from '@/components/AppModal.vue';
import AppSubtitle from '@/components/AppSubtitle.vue';
import AudioPlayer from '@/components/AudioPlayer.vue';
import SongEditForm from '@/components/SongEditForm.vue';
import { useSoundcloneStore } from '@/stores/soundclone';
import type { SongSerializer } from '@/types/core';
import { formatHumanDate } from '@/utils';

const store = useSoundcloneStore();

const newSongName = ref('');
const isOpen = ref(false);

const props = defineProps({
  song: { type: Object as PropType<SongSerializer>, required: true },
  index: { type: Number, required: true },
});

const humanDate = computed(() => formatHumanDate(props.song?.created as string));

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

    <!-- Use the modal component -->
    <AppModal :isOpen="isOpen" @update:isOpen="isOpen = $event">
      <AppSubtitle>Edit song</AppSubtitle>
      <SongEditForm :song="song" @update:song="isOpen = false" />
    </AppModal>

    <div class="flex justify-end gap-2 mt-4">
      <AppButton type="button" size="xs" @click.prevent="isOpen = true;">Edit</AppButton>
      <AppButton type="button" size="xs" @click.prevent="deleteSong()">Delete</AppButton>
    </div>
  </div>
</template>
