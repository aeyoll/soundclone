<script setup lang="ts">
import { inject, ref } from 'vue';

// Injection
const axios: any = inject('axios');

// Components
import DropZone from '@/components/DropZone.vue';
import FilePreview from '@/components/FilePreview.vue';

// File Management
import useFileList from '@/compositions/file-list';
import { FilePreviewStatus, UploadableFile } from '@/types/file';
import ViewTitle from '@/components/ViewTitle.vue';
import AppButton from '@/components/AppButton.vue';
import type { PlaylistSerializer } from '@/types/core';

const { files, addFiles, removeFile } = useFileList();

const playlist = ref<PlaylistSerializer|null>(null);
const newPlaylistName = ref<string>('');

function onInputChange(e): void {
  addFiles(e.target.files);
  e.target.value = null;
}

async function uploadFile(file: UploadableFile): Promise<void> {
  file.status = FilePreviewStatus.LOADING;

  try {
    const payload = {
      name: file.file.name,
      file: file.file,
    };

    if (playlist.value) {
      payload['playlist'] = playlist.value?.id;
    }

    const options = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    await axios.post('songs/', payload, options);
    file.status = FilePreviewStatus.UPLOADED;
  } catch (e) {
    file.status = FilePreviewStatus.ERROR;
  }
}
async function createPlaylist(): Promise<void> {
  try {
    const payload = {
      name: newPlaylistName.value,
    };

    const { data } = await axios.post('playlists/', payload);
    playlist.value = data;
  } catch (e) {
    // @TODO: handle error
  }
}

async function uploadFiles(files): Promise<void> {
  if (newPlaylistName.value) {
    await createPlaylist();
  }

  await Promise.all(files.map((file) => uploadFile(file)))
}
</script>

<template>
  <main class=" lg:w-1/2">
    <ViewTitle>Upload</ViewTitle>

    <DropZone class="drop-area" @files-dropped="addFiles" #default="{ dropZoneActive }">
      <label for="file-input" class="text-sm h-48 border flex justify-center rounded items-center mb-4">
        <span v-if="dropZoneActive">
          <span>Drop Them Here</span>
          <span class="smaller">to add them</span>
        </span>
        <span v-else>
          <span>Drag Your Files Here</span>
          <span class="smaller">
            or <strong><em class="cursor-pointer">click here</em></strong> to select files
          </span>
        </span>

        <input type="file" id="file-input" multiple @change="onInputChange" class="absolute -left-full" />
      </label>

      <label class="block">
        <span class="text-slate-700">Playlist</span>
        <input type="text" class="mt-1 block w-full rounded border-slate-200" placeholder="" v-model="newPlaylistName">
      </label>

      <div v-if="files.length" class="mt-4 lg:w-1/2">
        <FilePreview
          v-for="file of files"
          :key="file.id"
          :file="file"
          @remove="removeFile"
        />
      </div>
    </DropZone>
    <AppButton class="mt-4" @click.prevent="uploadFiles(files)">Upload</AppButton>
  </main>
</template>
