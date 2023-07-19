<script setup lang="ts">
import { FilePreviewStatus, UploadableFile } from '@/types/file';

defineProps({
  file: { type: UploadableFile, required: true }
});

defineEmits(['remove']);
</script>

<template>
  <div class="file-preview">
    <button @click="$emit('remove', file)" class="close-icon">&times;</button>
    <img :src="file.url" :alt="file.file.name" :title="file.file.name" />

    <span class="status-indicator loading-indicator" v-if="file.status === FilePreviewStatus.LOADING">
      In Progress
    </span>
    <span class="status-indicator success-indicator" v-if="file.status === FilePreviewStatus.UPLOADED">Uploaded</span>
    <span class="status-indicator failure-indicator" v-if="file.status === FilePreviewStatus.ERROR">Error</span>
  </div>
</template>
