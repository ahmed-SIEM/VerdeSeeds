import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class componentServcie {
  private apiUrl = `${environment.apiUrl}/components`;

  constructor(private http: HttpClient) {}

  getComponents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getComponent(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }



  createComponent(component: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, component);
  }

  updateComponent( component: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}`, component);
  }

  deleteComponent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAllcomponentsbyuserid(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }

  getusageRate(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usageRate`)
  }

}
