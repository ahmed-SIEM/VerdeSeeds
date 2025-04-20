import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export interface FirebaseUploadResponse {
  id: string;
  fileName: string;
  url: string;
}

interface CacheEntry {
  url: string;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {
  private apiUrl = `${environment.apiUrl}/api/firebase`;
  private storage = getStorage();
  private imageUrlCache = new Map<string, CacheEntry>();
  private CACHE_EXPIRY = 1000 * 60 * 30; // 30 minutes

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<FirebaseUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<FirebaseUploadResponse>(`${this.apiUrl}/upload`, formData);
  }

  deleteFile(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getFileUrl(fileName: string): Observable<string> {
    console.log('Fetching URL for file:', fileName);
    return this.http.get<string>(`${this.apiUrl}/url/${fileName}`);
  }

  getFile(fileName: string): Observable<Blob> {
    const url = `${this.apiUrl}/${fileName}`;
    console.log('Requesting file from:', url);
    return this.http.get(url, { 
      responseType: 'blob',
    });
  }

  getDirectImageUrl(fileName: string): Observable<string> {
    const cached = this.imageUrlCache.get(fileName);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp < this.CACHE_EXPIRY)) {
      return of(cached.url);
    }

    const storageRef = ref(this.storage, fileName);
    return from(
      getDownloadURL(storageRef).then(url => {
        this.imageUrlCache.set(fileName, { url, timestamp: now });
        return url;
      })
    );
  }

  clearCache(): void {
    this.imageUrlCache.clear();
  }
}
