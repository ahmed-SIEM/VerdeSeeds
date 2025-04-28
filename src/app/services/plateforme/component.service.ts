import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class componentServcie {
  private apiUrl = `${environment.apiUrl}/components`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getComponents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`, { headers: this.getHeaders() });
  }

  getComponent(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createComponent(component: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, component, { headers: this.getHeaders() });
  }

  updateComponent(component: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}`, component, { headers: this.getHeaders() });
  }

  deleteComponent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getAllcomponentsbyuserid(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() });
  }

  getusageRate(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usageRate`, { headers: this.getHeaders() });
  }
}
