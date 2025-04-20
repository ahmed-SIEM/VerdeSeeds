import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FirebaseUploadResponse {
  id: string;
  fileName: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {
  private apiUrl = `${environment.apiUrl}/api/firebase`;

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
    return this.http.get<string>(`${this.apiUrl}/url/${fileName}`);
  }

  getFile(fileName: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${fileName}`, { responseType: 'blob' });
  }
}
