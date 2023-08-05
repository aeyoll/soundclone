<script setup lang="ts">
import { FilePreviewStatus, UploadableFile } from '@/types/file';

defineProps({
  file: { type: UploadableFile, required: true },
});

defineEmits(['remove']);
</script>

<template>
  <div class="flex items-center justify-between gap-2 py-2 text-sm border-b">
    <div>
      {{ file.file.name }}

      <div class="text-xs text-slate-600" v-if="file.status === FilePreviewStatus.LOADING">
        In Progress
      </div>
      <div class="text-xs text-green-600" v-if="file.status === FilePreviewStatus.UPLOADED">Uploaded</div>
      <div class="text-xs text-red-600" v-if="file.status === FilePreviewStatus.ERROR">Error</div>
    </div>

    <button type="button" @click="$emit('remove', file)" class="close-icon">&times;</button>
  </div>
</template>
