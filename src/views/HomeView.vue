<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

import AppTitle from '@/components/AppTitle.vue';
import FeedPlaylist from '@/components/FeedPlaylist.vue';
import FeedSong from '@/components/FeedSong.vue';
import { useSoundcloneStore } from '@/stores/soundclone';
import type { PlaylistSerializer, SongSerializer } from '@/types/core';

const store = useSoundcloneStore();
const { feed } = storeToRefs(store);

onMounted(async () => {
  await store.getFeed();
});
</script>

<template>
  <main>
    <AppTitle class="mb-4">Feed</AppTitle>

    <div v-if="feed.length > 0" class="lg:w-2/3">
      <div v-for="(item, index) in feed" :key="item.id">
        <div v-if="item.hasOwnProperty('songs')">
          <FeedPlaylist :playlist="item as PlaylistSerializer" :index="index" />
        </div>

        <div v-else>
          <FeedSong :song="item as SongSerializer" :index="index" />
        </div>
      </div>
    </div>
    <div v-else class="alert alert-danger">
      No feed
    </div>
  </main>
</template>
