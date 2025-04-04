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
    return this.http.get<any[]>(`${this.apiUrl}/retrieve-all-Plateformes`);
  }

  getPlateforme(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/retrieve-Plateforme/${id}`);
  }



  createPlateforme(plateforme: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add-Plateforme`, plateforme);
  }

  updatePlateforme( plateforme: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update-Plateforme`, plateforme);
  }

  deletePlateforme(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-Plateforme/${id}`);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/auth/retrieve-all-Users`);
  }
}
