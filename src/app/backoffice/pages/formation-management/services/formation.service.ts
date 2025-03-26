// formation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Formation {
  id: number;
  nom: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  lieu: string;
  certification: boolean;
  typeFormation: 'THEORIQUE'|'PRATIQUE'|'MIXTE';
}

@Injectable({ providedIn: 'root' })
export class FormationService {
  private apiUrl = 'http://localhost:8080/api/formations';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Formation[]> {
    return this.http.get<Formation[]>(this.apiUrl);
  }

  getById(id: number): Observable<Formation> {
    return this.http.get<Formation>(`${this.apiUrl}/${id}`);
  }

  create(formation: Omit<Formation, 'id'>): Observable<Formation> {
    return this.http.post<Formation>(this.apiUrl, formation);
  }

  update(id: number, formation: Partial<Formation>): Observable<Formation> {
    return this.http.put<Formation>(`${this.apiUrl}/${id}`, formation);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}