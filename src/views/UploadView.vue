<script setup lang="ts">
import {
  computed, inject, onMounted, ref,
} from 'vue';
import { useRouter } from 'vue-router';

import AppButton from '@/components/AppButton.vue';
import AppSubtitle from '@/components/AppSubtitle.vue';
// File Management
import AppTitle from '@/components/AppTitle.vue';
// Components
import DropZone from '@/components/FormDropZone.vue';
import FormFilePreview from '@/components/FormFilePreview.vue';
import FormInput from '@/components/FormInput.vue';
import useFileList from '@/compositions/file-list';
import usePlaylist from '@/compositions/playlist';
import { SongPayload, useSoundcloneStore } from '@/stores/soundclone';
import { FilePreviewStatus, UploadableFile } from '@/types/file';

const store = useSoundcloneStore();

// Injection
const axios: any = inject('axios');

const { files, addFiles, removeFile } = useFileList();
const { playlist, newPlaylistName, createPlaylist } = usePlaylist();
const router = useRouter();

const playlists = computed(() => store.playlists);

const uploading = ref(false);

function onInputChange(e: any): void {
  addFiles(e.target.files);
  e.target.value = null;
}

async function uploadFile(file: UploadableFile): Promise<void> {
  // eslint-disable-next-line no-param-reassign
  file.status = FilePreviewStatus.LOADING;

  try {
    const payload = {
      name: file.file.name,
      file: file.file,
    } as SongPayload;

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

async function uploadFiles(): Promise<void> {
  uploading.value = true;

  if (newPlaylistName.value) {
    await createPlaylist();
  }

  await Promise.all(files.value.map((file) => uploadFile(file)));

  uploading.value = false;
  await router.push({ name: 'home' });
}

onMounted(async () => {
  await store.getPlaylists();
});
</script>

<template>
  <main class=" lg:w-1/2">
    <AppTitle class="mb-4">Upload</AppTitle>

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

      <div v-if="files.length" class="mb-4">
        <FormFilePreview
          v-for="file of files"
          :key="file.id"
          :file="file"
          @remove="removeFile"
        />
      </div>
    </DropZone>

    <AppSubtitle>Playlist</AppSubtitle>

    <FormInput v-model="newPlaylistName" label="New playlist" />

    <div v-if="playlists.length" class="text-slate-700">
      <p class="text-slate-500 my-2 text-sm">or</p>
      <p>Use an existing playlist</p>
      <div v-for="p in playlists" :key="p.id">
        <label :for="p.id?.toString()">
          <input type="radio" :value="p" :id="p.id?.toString()" v-model="playlist">
          {{ p.name }}
        </label>
      </div>
    </div>
    <AppButton class="mt-4" @click.prevent="uploadFiles()" :disabled="uploading">Upload</AppButton>
  </main>
</template>
