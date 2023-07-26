<script setup lang="ts">
import {
  computed, inject, onMounted, ref,
} from 'vue';

// Components
import DropZone from '@/components/FormDropZone.vue';
import FilePreview from '@/components/FormFilePreview.vue';

// File Management
import ViewTitle from '@/components/AppTitle.vue';
import AppButton from '@/components/AppButton.vue';
import FormInput from '@/components/FormInput.vue';
import useFileList from '@/compositions/file-list';
import { FilePreviewStatus, UploadableFile } from '@/types/file';
import { useSoundcloneStore } from '@/stores/soundclone';
import type { PlaylistSerializer } from '@/types/core';

const store = useSoundcloneStore();

// Injection
const axios: any = inject('axios');

const { files, addFiles, removeFile } = useFileList();

const playlists = computed(() => store.playlists);
const playlist = ref<PlaylistSerializer|null>(null);
const newPlaylistName = ref<string>('');

function onInputChange(e): void {
  addFiles(e.target.files);
  e.target.value = null;
}

async function uploadFile(file: UploadableFile): Promise<void> {
  // eslint-disable-next-line no-param-reassign
  file.status = FilePreviewStatus.LOADING;

  try {
    interface Payload {
      name: string,
      file: File,
      playlist: number|null,
    }
    const payload = {
      name: file.file.name,
      file: file.file,
    } as Payload;

    if (playlist.value) {
      payload.playlist = playlist.value?.id;
    }

    const options = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    await axios.post('songs/', payload, options);
    // eslint-disable-next-line no-param-reassign
    file.status = FilePreviewStatus.UPLOADED;
  } catch (e) {
    // eslint-disable-next-line no-param-reassign
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

async function uploadFiles(): Promise<void> {
  if (newPlaylistName.value) {
    await createPlaylist();
  }

  await Promise.all(files.value.map((file) => uploadFile(file)));
}

onMounted(async () => {
  await store.getPlaylists();
});
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

      <FormInput v-model="newPlaylistName" label="New playlist" />

      <p>Use an existing playlist</p>
      <div v-for="p in playlists" :key="p.id">
        <label :for="p.id">
          <input type="radio" :value="p" :id="p.id" v-model="playlist">
          {{ p.name }}
        </label>
      </div>

      <div v-if="files.length" class="mt-4 lg:w-1/2">
        <FilePreview
          v-for="file of files"
          :key="file.id"
          :file="file"
          @remove="removeFile"
        />
      </div>
    </DropZone>
    <AppButton class="mt-4" @click.prevent="uploadFiles()">Upload</AppButton>
  </main>
</template>
