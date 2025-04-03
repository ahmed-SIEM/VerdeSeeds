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

  createPlateforme(plateforme: any): Observable<any> {
    return this.myHttp.post(`${this.url}/add-Plateforme`, plateforme).pipe(
      catchError(error => {
        console.error('Erreur lors de la création de la Plateforme', error);
        return throwError(() => new Error('Erreur réseau. Veuillez réessayer plus tard.'));
      })
    );
  }

  updatePlateforme(id: number, plateforme: any): Observable<any> {
    return this.myHttp.put(`${this.url}/update-Plateforme/${id}`, plateforme).pipe(
      catchError(error => {
        console.error('Erreur lors de la mise à jour de la Plateforme', error);
        return throwError(() => new Error('Erreur réseau. Veuillez réessayer plus tard.'));
      })
    );
  }

  deletePlateforme(id: number): Observable<any> {
    return this.myHttp.delete(`${this.url}/delete-Plateforme/${id}`).pipe(
      catchError(error => {
        console.error('Erreur lors de la suppression de la Plateforme', error);
        return throwError(() => new Error('Erreur réseau. Veuillez réessayer plus tard.'));
      })
    );
  }

  getAvailableUsers(): Observable<any[]> {
    return this.myHttp.get<any[]>('http://localhost:8081/users/available').pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des utilisateurs disponibles', error);
        return throwError(() => new Error('Erreur réseau. Veuillez réessayer plus tard.'));
      })
    );
  }
}
