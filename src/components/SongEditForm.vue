<script setup lang="ts">
import { computed, PropType, ref } from 'vue';

import AppButton from '@/components/AppButton.vue';
import AppSubtitle from '@/components/AppSubtitle.vue';
import FormInput from '@/components/FormInput.vue';
import { useSoundcloneStore } from '@/stores/soundclone';
import type { PlaylistSerializer, SongSerializer } from '@/types/core';

const store = useSoundcloneStore();

const newSongName = ref('');

const playlists = computed(() => store.playlists);
const playlist = ref<PlaylistSerializer|null>(null);
const newPlaylistName = ref<string>('');

const props = defineProps({
  song: { type: Object as PropType<SongSerializer>, required: true },
});

const emit = defineEmits(['update:song']);

const updateSong = () => {
  // Merge the existing song with its new name
  const payload = {
    ...props.song,
    ...{
      name: newSongName.value,
    },
  } as SongSerializer;

  // Delete "file" from the payload
  // @ts-ignore
  delete payload.file;

  // Update using the API
  store.updateSong(props.song?.id as number, payload);

  emit('update:song');
};
</script>

<template>
  <FormInput v-model="newSongName" label="Name" class="mb-4" />

  <AppSubtitle>Playlist</AppSubtitle>

  <FormInput v-model="newPlaylistName" label="New playlist" class="mb-4" />

  <div v-if="playlists.length" class="mb-4">
    <p class="text-slate-500 my-2 text-sm">or</p>
    <p>Use an existing playlist</p>
    <div v-for="p in playlists" :key="p.id">
      <label :for="p.id?.toString()">
        <input type="radio" :value="p" :id="p.id?.toString()" v-model="playlist">
        {{ p.name }}
      </label>
    </div>
  </div>

  <AppButton @click="updateSong()">Save</AppButton>
</template>
