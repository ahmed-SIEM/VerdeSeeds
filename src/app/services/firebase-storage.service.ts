import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { getStorage, ref, getDownloadURL, deleteObject } from "firebase/storage";
import { catchError } from 'rxjs/operators';

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

  deleteFile(fileName: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${fileName}`, {
      withCredentials: true
    }).pipe(
      catchError(error => {
        if (error.status === 0 || error.status === 403) {
          console.error('CORS or Auth Error:', error);
          // Try to delete directly from Firebase if backend fails
          return this.deleteDirectFromFirebase(fileName);
        }
        throw error;
      })
    );
  }

  private deleteDirectFromFirebase(fileName: string): Observable<void> {
    const storageRef = ref(this.storage, fileName);
    return from(deleteObject(storageRef));
  }

  getFileUrl(fileName: string): Observable<string> {
    console.log('Fetching URL for file:', fileName);
    return this.http.get<string>(`${this.apiUrl}/url/${fileName}`, {
      headers: {
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }).pipe(
      catchError(error => {
        if (error.status === 0 || error.status === 403) {
          console.warn('CORS or Firebase Auth Error, falling back to direct URL');
          return this.getDirectImageUrl(fileName);
        }
        throw error;
      })
    );
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
