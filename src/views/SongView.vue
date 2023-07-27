<script setup lang="ts">
import type { Ref } from 'vue';
import {
  computed,
  inject, onMounted, ref,
} from 'vue';
import { useRoute } from 'vue-router';

import AppButton from '@/components/AppButton.vue';
import AppSubtitle from '@/components/AppSubtitle.vue';
import AppTitle from '@/components/AppTitle.vue';
import AudioPlayer from '@/components/AudioPlayer.vue';
import FormDropZone from '@/components/FormDropZone.vue';
import FormFilePreview from '@/components/FormFilePreview.vue';
import FormInput from '@/components/FormInput.vue';
import useFileList from '@/compositions/file-list';
import type { SongSerializer, VersionSerializer } from '@/types/core';
import { FilePreviewStatus, UploadableFile } from '@/types/file';
import { formatHumanDate } from '@/utils';

const axios: any = inject('axios');
const route = useRoute();

const { files, addFiles, removeFile } = useFileList();

const song: Ref<SongSerializer|null> = ref(null);
const currentVersion: Ref<SongSerializer|VersionSerializer|null> = ref(null);
const newVersionName = ref<string>('');

const humanDate = computed(() => formatHumanDate(song.value?.created as string));

const getSong = async () => {
  const { data } = await axios.get(`songs/${route.params.id}/`);
  song.value = data;
};

function onInputChange(e: any): void {
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
      song: number,
    }
    const payload = {
      name: newVersionName.value,
      file: file.file,
      song: song.value?.id,
    } as Payload;

    const options = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    await axios.post('versions/', payload, options);
    // eslint-disable-next-line no-param-reassign
    file.status = FilePreviewStatus.UPLOADED;

    await getSong();
    newVersionName.value = '';
    files.value = [];
  } catch (e) {
    // eslint-disable-next-line no-param-reassign
    file.status = FilePreviewStatus.ERROR;
  }
}

async function uploadFiles(): Promise<void> {
  await Promise.all(files.value.map((file) => uploadFile(file)));
}

onMounted(async () => {
  await getSong();
  currentVersion.value = song.value;
});
</script>

<template>
  <main v-if="song && currentVersion" class="lg:w-2/3">
    <div class="flex items-center justify-between mb-4">
      <AppTitle>{{ song.name }}</AppTitle>
      <div class="text-slate-500 text-xs">{{ humanDate }}</div>
    </div>

    <AudioPlayer :song="currentVersion" :index="0" class="mb-4" />

    <div v-if="song.versions && song.versions?.length > 0" class="mb-4">
      <AppSubtitle>Versions</AppSubtitle>

      <div class="border border-slate-200 rounded text-sm">
        <button
          class="p-2 border-b w-full text-left flex justify-between items-center"
          :class="{ 'bg-slate-100': currentVersion === song }"
          type="button"
          @click.prevent="currentVersion = song">
          Original
          <span class="text-xs text-slate-500">
            {{ humanDate }}
          </span>
        </button>

        <div v-for="(version, index) in song.versions" :key="version.id">
          <button
            class="p-2 w-full text-left flex justify-between items-center"
            :class="{
              'border-b': index !== song.versions.length - 1,
              'bg-slate-100': currentVersion === version,
            }"
            type="button"
            @click.prevent="currentVersion = version">
            {{ version.name }}
            <span class="text-xs text-slate-500">
              {{ formatHumanDate(version.created as string) }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <AppSubtitle>Add a new version</AppSubtitle>

    <FormInput v-model="newVersionName" label="Version name" class="mb-4" />

    <FormDropZone class="drop-area" @files-dropped="addFiles" #default="{ dropZoneActive }" v-if="files.length === 0">
      <label for="file-input" class="text-sm h-48 border flex justify-center rounded items-center mb-4">
        <span v-if="dropZoneActive">
          <span>Drop file here</span>
          <span class="smaller">to add it</span>
        </span>
        <span v-else>
          <span>Drag your file here</span>
          <span class="smaller">
            or <strong><em class="cursor-pointer">click here</em></strong> to select file
          </span>
        </span>

        <input type="file" id="file-input" @change="onInputChange" class="absolute -left-full" />
      </label>
    </FormDropZone>

    <div v-if="files.length" class="mb-4 lg:w-1/2">
      <FormFilePreview
        v-for="file of files"
        :key="file.id"
        :file="file"
        @remove="removeFile"
      />
    </div>
    <AppButton class="mb-4" @click.prevent="uploadFiles()">Upload</AppButton>
  </main>
</template>
