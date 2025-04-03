import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlateformeService {
  private url: string = 'http://localhost:8081/plateforme';

  constructor(private myHttp: HttpClient) {}
  getPlateforms(): Observable<any> {
    return this.myHttp.get(`${this.url}/retrieve-all-Plateformes`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des Plateformes', error);
        return throwError(() => new Error('Erreur réseau. Veuillez réessayer plus tard.'));
      })
    );
  }
}
