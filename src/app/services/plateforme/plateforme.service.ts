import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
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

  constructor(private http: HttpClient) {}

  getPlateforms(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getReport(): Observable<report> {
    return this.http.get<report>(`${this.apiUrl}/generateReport`);
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


  updateUserPlan( plan: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/user/${plan}` , {});
  }



  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/auth/retrieve-all-Users`);
  }

  getAllPlatforms(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
  getMostlyBoughtPacks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mostlyBoughtPacks`);
  }

}
