export enum FilePreviewStatus {
  // eslint-disable-next-line no-unused-vars
  LOADING,
  // eslint-disable-next-line no-unused-vars
  UPLOADED,
  // eslint-disable-next-line no-unused-vars
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
