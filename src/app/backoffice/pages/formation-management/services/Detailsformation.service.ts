import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// 🧾 DTO qu’on envoie vers le backend
export interface DetailsFormationDTO {
  idDetaille?: number;
  objectif: string;
  contenu: string;
  duree: number;
  materielRequis: string;
  idFormation: number; // ✅ ici on envoie juste l’id
}

@Injectable({
  providedIn: 'root'
})
export class DetailsFormationService {
  private baseUrl = 'http://localhost:8081/details-formation';

  constructor(private http: HttpClient) {}

  // ➕ Ajouter détail
  add(details: DetailsFormationDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, details).pipe(
      catchError(err => {
        console.error('❌ Erreur ajout détail formation:', err);
        return throwError(() => err);
      })
    );
  }

  // ✏️ Modifier détail
  update(id: number, details: DetailsFormationDTO): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, details).pipe(
      catchError(err => {
        console.error('❌ Erreur mise à jour détail formation:', err);
        return throwError(() => err);
      })
    );
  }

  // 🔍 Obtenir détail par ID de DÉTAIL
  getById(id: number): Observable<DetailsFormationDTO> {
    return this.http.get<DetailsFormationDTO>(`${this.baseUrl}/${id}`).pipe(
      catchError(err => {
        console.error('❌ Erreur chargement détail formation:', err);
        return throwError(() => err);
      })
    );
  }

  // 🔍 Obtenir détail par ID de FORMATION
  getByFormationId(idFormation: number): Observable<DetailsFormationDTO> {
    return this.http.get<DetailsFormationDTO>(`${this.baseUrl}/by-formation/${idFormation}`).pipe(
      catchError(err => {
        console.error('❌ Erreur getByFormationId:', err);
        return throwError(() => err);
      })
    );
  }

  // 🗑️ Supprimer détail
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(err => {
        console.error('❌ Erreur suppression détail formation:', err);
        return throwError(() => err);
      })
    );
  }
}
