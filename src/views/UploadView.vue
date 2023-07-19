<script setup lang="ts">
import { inject } from 'vue';

// Injection
const axios: any = inject('axios');

// Components
import DropZone from '@/components/DropZone.vue'
import FilePreview from '@/components/FilePreview.vue'

// File Management
import useFileList from '@/compositions/file-list'
import { FilePreviewStatus, UploadableFile } from '@/types/file';

const { files, addFiles, removeFile } = useFileList()

function onInputChange(e): void {
  addFiles(e.target.files);
  e.target.value = null;
}

async function uploadFile(file: UploadableFile): Promise<void> {
  // track status and upload file
  file.status = FilePreviewStatus.LOADING;

  try {
    const body = {
      name: file.file.name,
      file: file.file,
    }
    await axios.post('songs/', body)
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
    <h1>Upload</h1>

    <DropZone class="drop-area" @files-dropped="addFiles" #default="{ dropZoneActive }">
      <label for="file-input">
        <span v-if="dropZoneActive">
          <span>Drop Them Here</span>
          <span class="smaller">to add them</span>
        </span>
        <span v-else>
          <span>Drag Your Files Here</span>
          <span class="smaller">
            or <strong><em>click here</em></strong> to select files
          </span>
        </span>

        <input type="file" id="file-input" multiple @change="onInputChange" />
      </label>

      <div v-if="files.length">
        <FilePreview
          v-for="file of files"
          :key="file.id"
          :file="file"
          tag="li"
          @remove="removeFile"
        />
      </div>
    </DropZone>
    <button @click.prevent="uploadFiles(files)" class="upload-button">Upload</button>
  </main>
</template>
