<script setup lang="ts">
import { inject } from 'vue';

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

const { files, addFiles, removeFile } = useFileList();

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

async function uploadFiles(files): Promise<void> {
  await Promise.all(files.map((file) => uploadFile(file)))
}
</script>

<template>
  <main>
    <ViewTitle>Upload</ViewTitle>

    <DropZone class="drop-area" @files-dropped="addFiles" #default="{ dropZoneActive }">
      <label for="file-input" class="text-sm h-48 border flex justify-center rounded items-center lg:w-1/2">
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
