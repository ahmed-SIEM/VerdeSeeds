// participation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParticipationService {
  private apiUrl = `${environment.apiUrl}/participations`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  participer(formationId: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/inscrire`,
      { formationId }, // OK avec DTO Java
      { headers: this.getHeaders() }
    );
  }

  getMesParticipations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mes-participations`, {
      headers: this.getHeaders()
    });
  }

  annulerParticipation(idParticipation: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/annuler/${idParticipation}`, {
      headers: this.getHeaders()
    });
  }

  getWaitingPosition(formationId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/waiting-position/${formationId}`, {
      headers: this.getHeaders()
    });
  }
  getConfirmedParticipants(formationId: number): Observable<number> {
    return this.http.get<number>(`http://localhost:8081/participations/count-confirmed/${formationId}`);
  }

  checkConflict(formationId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/check-conflict/${formationId}`, {
      headers: this.getHeaders()
    });
  }

  checkUserBlocked(formationId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-blocked/${formationId}`, {
      headers: this.getHeaders()
    });
  }
  
  getRemainingBlockTime(formationId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/remaining-block-time/${formationId}`, {
      headers: this.getHeaders()
    });
  }

  isAlreadyParticipating(formationId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/is-participating/${formationId}`, {
      headers: this.getHeaders()
    });
  }
}
