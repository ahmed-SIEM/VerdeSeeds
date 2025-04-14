import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlateformeService {
  private apiUrl = `${environment.apiUrl}/plateforme`;

  constructor(private http: HttpClient) {}

  getPlateforms(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getPlateforme(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createPlateforme(plateforme: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, plateforme);
  }

  updatePlateforme(plateforme: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}`, plateforme);
  }

  deletePlateforme(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


  updateUserPlan(id: number, plan: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/user/${id}/${plan}` , {});
  }



  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/auth/retrieve-all-Users`);
  }

  getAllPlatforms(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
}
