import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; 
import { HttpHeaders } from '@angular/common/http';
interface report {
  TotalPlateformes : number ,
  ExpiredPlateformes : number , 
  ActivePlateformes : number
}
@Injectable({
  providedIn: 'root'
})
export class PlateformeService {
  private apiUrl = `${environment.apiUrl}/plateforme`;

    private getHeaders(): HttpHeaders {
      const token = localStorage.getItem('token');
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

  constructor(private http: HttpClient) {}

  getPlateforms(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`, { headers: this.getHeaders() });
  }

  getReport(): Observable<report> {
    return this.http.get<report>(`${this.apiUrl}/generateReport`, { headers: this.getHeaders() });
  }

  getPlateforme(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createPlateforme(plateforme: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, plateforme, { headers: this.getHeaders() });
  }

  updatePlateforme(plateforme: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}`, plateforme, { headers: this.getHeaders() });
  }

  deletePlateforme(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }


  updateUserPlan( plan: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/user/${plan}` , {}, { headers: this.getHeaders() });
  }



  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/auth/retrieve-all-Users`, { headers: this.getHeaders() });
  }

  getAllPlatforms(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
  getMostlyBoughtPacks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mostlyBoughtPacks`, { headers: this.getHeaders() });
  }

}
