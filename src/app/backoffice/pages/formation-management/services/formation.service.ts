import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Formation {
  idFormation: number;
  nom: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  lieu: string;
  certification: boolean;
  photoPath?: string;
  noteMinPourCertificat: number;
  capacity: number;
  typeFormation: 'THEORIQUE' | 'PRATIQUE' | 'MIXTE';
  detailFormation?: any;
  participations?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class FormationService {
  private baseUrl = 'http://localhost:8081/formations';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Formation[]> {
    return this.http.get<Formation[]>(this.baseUrl).pipe(
      catchError(error => {
        console.error('Erreur chargement formations:', error);
        return throwError(() => error);
      })
    );
  }

  getAllWithDetails(): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.baseUrl}/all-with-details`).pipe(
      catchError(error => {
        console.error('Erreur chargement formations avec détails:', error);
        return throwError(() => error);
      })
    );
  }

  getById(idFormation: number): Observable<Formation> {
    return this.http.get<Formation>(`${this.baseUrl}/${idFormation}`).pipe(
      catchError(error => {
        console.error(`Erreur formation ID ${idFormation}:`, error);
        return throwError(() => error);
      })
    );
  }

  create(formData: FormData): Observable<Formation> {
    return this.http.post<Formation>(`${this.baseUrl}/add`, formData).pipe(
      catchError(error => {
        console.error('Erreur création formation:', error);
        return throwError(() => error);
      })
    );
  }

  update(idFormation: number, formData: FormData): Observable<Formation> {
    return this.http.put<Formation>(`${this.baseUrl}/update/${idFormation}`, formData).pipe(
      catchError(error => {
        console.error(`Erreur mise à jour formation ID ${idFormation}:`, error);
        return throwError(() => error);
      })
    );
  }

  delete(idFormation: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${idFormation}`).pipe(
      catchError(error => {
        console.error(`Erreur suppression formation ID ${idFormation}:`, error);
        return throwError(() => error);
      })
    );
  }

  getTauxReussite(idFormation: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${idFormation}/taux-reussite`).pipe(
      catchError(error => {
        console.error(`Erreur taux de réussite:`, error);
        return throwError(() => error);
      })
    );
  }

  getCalendarEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/calendar`).pipe(
      catchError(error => {
        console.error(`Erreur chargement calendrier:`, error);
        return throwError(() => error);
      })
    );
  }
  getByIdWithDetails(id: number): Observable<Formation> {
    return this.http.get<Formation>(`${this.baseUrl}/with-details/${id}`).pipe(
      catchError(error => {
        console.error(`Erreur chargement formation avec détails ID ${id}:`, error);
        return throwError(() => error);
      })
    );
  }
  
}
