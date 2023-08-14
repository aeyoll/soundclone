<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

import AppTitle from '@/components/AppTitle.vue';
import AppWarning from '@/components/AppWarning.vue';
import FeedPlaylist from '@/components/FeedPlaylist.vue';
import { useSoundcloneStore } from '@/stores/soundclone';
import type { PlaylistSerializer } from '@/types/core';

const store = useSoundcloneStore();
const { playlists } = storeToRefs(store);

onMounted(async () => {
  await store.getPlaylists();
});
</script>

<template>
  <main>
    <AppTitle class="mb-4">Playlists</AppTitle>

    <div v-if="playlists.length > 0" class="lg:w-2/3">
      <div v-for="(item, index) in playlists" :key="item.id">
        <FeedPlaylist :playlist="item as PlaylistSerializer" :index="index" />
      </div>
    </div>

    <AppWarning v-else>
      No playlists
    </AppWarning>
  </main>
</template>
