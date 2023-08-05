<script setup lang="ts">
import {
  computed, onMounted, PropType, ref,
} from 'vue';

import AppButton from '@/components/AppButton.vue';
import AppSubtitle from '@/components/AppSubtitle.vue';
import FormInput from '@/components/FormInput.vue';
import usePlaylist from '@/compositions/playlist';
import { SongPayload, useSoundcloneStore } from '@/stores/soundclone';
import type { SongSerializer } from '@/types/core';

const store = useSoundcloneStore();
const { playlist, newPlaylistName, createPlaylist } = usePlaylist();

const playlists = computed(() => store.playlists);

const props = defineProps({
  song: { type: Object as PropType<SongSerializer>, required: true },
});

const newSongName = ref('');

const emit = defineEmits(['update:song']);

const updateSong = async () => {
  if (newPlaylistName.value) {
    await createPlaylist();
  }

  // Merge the existing song with its new name
  const payload = {
    ...props.song,
    ...{
      name: newSongName.value,
    },
  } as SongPayload;

  if (playlist.value) {
    payload.playlist = playlist.value?.id;
  }

  // Delete "file" from the payload
  // @ts-ignore
  delete payload.file;

  // Update using the API
  await store.updateSong(props.song?.id as number, payload);

  emit('update:song');

  await store.getFeed();
};

onMounted(() => {
  if (props.song?.name) {
    newSongName.value = props.song?.name;
  }
});
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
