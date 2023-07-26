<script setup lang="ts">
import AppTitle from '@/components/AppTitle.vue';
import {
  inject, onMounted, Ref, ref,
} from 'vue';
import { useRoute } from 'vue-router';
import AudioPlayer from '@/components/AudioPlayer.vue';
import type { SongSerializer, VersionSerializer } from '@/types/core';

const axios = inject('axios');
const route = useRoute();

const song: Ref<SongSerializer|null> = ref(null);
const currentVersion: Ref<SongSerializer|VersionSerializer|null> = ref(null);

onMounted(async () => {
  const { data } = await axios.get(`songs/${route.params.id}/`);
  song.value = data;
  currentVersion.value = data;
});
</script>

<template>
  <main v-if="song && currentVersion" class="lg:w-2/3">
    <AppTitle>{{ song.name }}</AppTitle>

    <AudioPlayer :song="currentVersion" :index="0" />
  </main>
</template>
