<script setup lang="ts">
import { onMounted } from 'vue';
import ViewTitle from '@/components/AppTitle.vue';
import FeedSong from '@/components/FeedSong.vue';
import FeedPlaylist from '@/components/FeedPlaylist.vue';
import { useSoundcloneStore } from '@/stores/soundclone.ts';
import { storeToRefs } from 'pinia';
import type { PlaylistSerializer, SongSerializer } from '@/types/core';

const store = useSoundcloneStore();
const { feed } = storeToRefs(store);

onMounted(async () => {
  await store.getFeed();
});
</script>

<template>
  <main>
    <ViewTitle>Feed</ViewTitle>

    <div v-if="feed.length > 0" class="lg:w-2/3">
      <div v-for="item in feed" :key="item.id">
        <div v-if="item.hasOwnProperty('songs')">
          <FeedPlaylist :playlist="item as PlaylistSerializer" />
        </div>

        <div v-else>
          <FeedSong :song="item as SongSerializer" />
        </div>
      </div>
    </div>
    <div v-else class="alert alert-danger">
      No feed
    </div>
  </main>
</template>
