export interface StorageFile {
  name: string;
  bucket: string;
  owner: string;
  path: string;
  size: number;
  type: string;
  metadata: any;
  created_at: string;
  updated_at: string;
  url?: string;
}

export interface UploadResponse {
  path: string;
  url: string;
  error?: string;
}
