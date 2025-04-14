import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { StorageFile, UploadResponse } from '../interfaces/storage.interface';
import { Observable, from, map } from 'rxjs';

// Supabase FileObject type (adjusted for your case)
interface FileObject {
  name: string;
  bucket: string;
  owner: string;
  path?: string;
  size?: number;
  created_at?: string;
  updated_at?: string;
  metadata?: any;
}

// Corrected FileMetadata type (with required fields)
interface FileMetadata {
  name: string;
  url: string;
  bucket: string;
  owner: string;
  path: string;
  size: number;
  created_at: string;
  updated_at: string;
  type: string;
  metadata: any;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.key
    );
  }

  async uploadFile(
    bucket: string,
    path: string,
    file: File
  ): Promise<UploadResponse> {
    try {
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .upload(path, file);

      if (error) throw error;

      const url = this.getPublicUrl(bucket, data.path);

      return {
        path: data.path,
        url
      };
    } catch (error: any) {
      return {
        path: '',
        url: '',
        error: error.message || 'Unknown error occurred during file upload'
      };
    }
  }

  async deleteFile(bucket: string, path: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting file from ${bucket}: ${error.message}`);
      return false;
    }
  }

  getPublicUrl(bucket: string, path: string): string {
    const { data: { publicUrl } } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    return publicUrl || ''; // Ensure it's never null or undefined
  }

  listFiles(bucket: string): Observable<StorageFile[]> {
    return from(
      this.supabase.storage.from(bucket).list()
    ).pipe(
      map(({ data, error }: { data: FileObject[] | null; error: any }) => {
        if (error || !data) {
          return []; // Return an empty array in case of an error or null data
        }
        
        return data.map((file: FileObject) => ({
          name: file.name,
          url: this.getPublicUrl(bucket, file.name),
          bucket,
          owner: file.owner || '', // Provide default or actual value
          path: file.path || '',    // Provide default or actual value
          size: file.size || 0,     // Provide default or actual value
          created_at: file.created_at || '', // Provide default or actual value
          updated_at: file.updated_at || '', // Provide default or actual value
          type: 'file',            // Provide default or actual value
          metadata: file.metadata || {} // Provide default or actual value
        }));
      })
    );
  }
}
