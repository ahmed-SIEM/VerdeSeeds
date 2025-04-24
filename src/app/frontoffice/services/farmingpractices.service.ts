import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormationService {
  private baseUrl = 'http://localhost:8081/formations';

  constructor(private http: HttpClient) {}

  
  getAllFormations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all-with-details`);
  }

  
  getDetailsByFormationId(idFormation: number): Observable<any> {
    return this.http.get(`${this.baseUrl.replace('/formations', '/details-formation')}/by-formation/${idFormation}`);
  }

  
  getFormationsByType(type: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/type/${type}`);
  }

  
  getFormationsForCalendar(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/calendar`);
  }
}
