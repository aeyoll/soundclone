export enum FilePreviewStatus {
  LOADING,
  UPLOADED,
  ERROR,
}

export class UploadableFile {
  public id: string;
  public file: File;
  public url: string;
  public status: FilePreviewStatus|null;

  constructor(file: File) {
    this.file = file;
    this.id = `${file.name}-${file.size}-${file.lastModified}-${file.type}`;
    this.url = URL.createObjectURL(file);
    this.status = null;
  }
}
