import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatistiqueService {
  private baseUrl = 'http://localhost:8081/stats';

  constructor(private http: HttpClient) {}

  getTauxReussite(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/taux-reussite`);
  }

  getFormationsPopulaires(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/plus-populaires`);
  }

  getMoyenneNotes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/moyenne-notes`);
  }

  getTotalFormations(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/total`);
  }

  getFormationsCertifiantes(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/certifiantes`);
  }

  getMoyenneCapacite(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/moyenne-capacite`);
  }

  getFormationsParType(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/par-type`);
  }

  getMoyenneDuree(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/moyenne-duree`);
  }

  getFormationsSansDetails(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/sans-details`);
  }
}
