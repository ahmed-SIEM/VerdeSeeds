import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormationService {
  private apiUrl = 'http://localhost:8081/formations/all-with-details';

  constructor(private http: HttpClient) {}

  getAllFormations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getDetailsByFormationId(idFormation: number): Observable<any> {
    return this.http.get(`http://localhost:8081/details-formation/by-formation/${idFormation}`);
  }
}
