import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private url: string = 'http://localhost:8081'  // Définir l'URL depuis `environment.ts`

  constructor(private myHttp: HttpClient) {}

  getUsers(): Observable<any> {
    return this.myHttp.get(`${this.url}/auth/retrieve-all-Users`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
        return throwError(() => new Error('Erreur réseau. Veuillez réessayer plus tard.'));
      })
    );
  }
}
