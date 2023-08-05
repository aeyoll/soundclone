function renameFile(originalFile: File, newName: string): File {
  return new File([originalFile], newName, {
    type: originalFile.type,
    lastModified: originalFile.lastModified,
  });
}

export function removeExtension(filename: string): string {
  return filename.split('.').slice(0, -1).join('.');
}

export function removePrefix(fileName: string): string {
  return fileName.replace(/^\s*\d+\s*-\s*/, '');
}

export function toCapitalCase(inputString: string): string {
  // Split the input string into words using space as the delimiter
  const words = inputString.split(' ');

  // Capitalize the first letter of each word
  const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));

  // Join the capitalized words back into a single string with spaces
  return capitalizedWords.join(' ');
}

export function computeFileName(originalName: string): string {
  // First, remove the extension
  let newName = removeExtension(originalName);

  // Then, remove "01-" prefix
  newName = removePrefix(newName);

  // Finally, convert it to capital case
  newName = toCapitalCase(newName);

  return newName;
}

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
    const newName = computeFileName(file.name);
    this.file = renameFile(file, newName);
    this.id = `${file.name}-${file.size}-${file.lastModified}-${file.type}`;
    this.url = URL.createObjectURL(file);
    this.status = null;
  }
}
