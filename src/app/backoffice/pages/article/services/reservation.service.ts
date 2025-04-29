import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reservation {
  id?: number;
  startDatetime: string;
  endDatetime: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  article?: { id: number };
  articleTitle?: string;
  payment?: any;
  user?: { idUser: number };  // Add user field
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:8081/api/reservations';

  constructor(private http: HttpClient) {}

  private async generateHeaders(): Promise<HttpHeaders> {
    const token =  localStorage.getItem('token');
    if (!token) {
      throw new Error('No token available. User is not logged in.');
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAllReservations(): Observable<Reservation[]> {
    return new Observable(observer => {
      this.generateHeaders().then(headers => {
        this.http.get<Reservation[]>(this.apiUrl, { headers }).subscribe(
          data => observer.next(data),
          error => observer.error(error),
          () => observer.complete()
        );
      }).catch(error => observer.error(error));
    });
  }

  getReservationById(id: number): Observable<Reservation> {
    return new Observable(observer => {
      this.generateHeaders().then(headers => {
        this.http.get<Reservation>(`${this.apiUrl}/${id}`, { headers }).subscribe(
          data => observer.next(data),
          error => observer.error(error),
          () => observer.complete()
        );
      }).catch(error => observer.error(error));
    });
  }

  getReservationsByArticle(articleId: number): Observable<Reservation[]> {
    return new Observable(observer => {
      this.generateHeaders().then(headers => {
        this.http.get<Reservation[]>(`${this.apiUrl}/by-article/${articleId}`, { headers }).subscribe(
          data => observer.next(data),
          error => observer.error(error),
          () => observer.complete()
        );
      }).catch(error => observer.error(error));
    });
  }

  createReservation(articleId: number, reservationData: Partial<Reservation>): Observable<Reservation> {
    return new Observable(observer => {
      this.generateHeaders().then(headers => {
        const url = `${this.apiUrl}/articles/${articleId}`;
        const userId = this.getCurrentUserId();
        const payload = {
          ...reservationData,
          article: { id: articleId },
          user: { idUser: userId }
        };
        
        this.http.post<Reservation>(url, payload, { headers }).subscribe({
          next: (data) => observer.next(data),
          error: (error) => observer.error(error),
          complete: () => observer.complete()
        });
      }).catch(error => observer.error(error));
    });
  }

  private getCurrentUserId(): number {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      throw new Error('No authenticated user found');
    }
    const user = JSON.parse(userStr);
    return user.idUser;
  }

  updateReservation(articleId: number, reservationId: number, updatedReservation: Partial<Reservation>): Observable<Reservation> {
    return new Observable(observer => {
      this.generateHeaders().then(headers => {
        const url = `${this.apiUrl}/articles/${articleId}/reservations/${reservationId}`;
        this.http.put<Reservation>(url, updatedReservation, { headers }).subscribe(
          data => observer.next(data),
          error => observer.error(error),
          () => observer.complete()
        );
      }).catch(error => observer.error(error));
    });
  }

  getReservationsByArticleId(articleId: number): Observable<Reservation[]> {
    return new Observable(observer => {
      this.generateHeaders().then(headers => {
        const url = `${this.apiUrl}/by-article/${articleId}`;
        this.http.get<Reservation[]>(url, { headers }).subscribe(
          data => observer.next(data),
          error => observer.error(error),
          () => observer.complete()
        );
      }).catch(error => observer.error(error));
    });
  }

  getReservationsByArticleTitle(articleTitle: string): Observable<Reservation[]> {
    return new Observable(observer => {
      this.generateHeaders().then(headers => {
        const url = `${this.apiUrl}/articles/${encodeURIComponent(articleTitle)}/reservations`;
        this.http.get<Reservation[]>(url, { headers }).subscribe(
          data => observer.next(data),
          error => observer.error(error),
          () => observer.complete()
        );
      }).catch(error => observer.error(error));
    });
  }

  deleteReservation(id: number): Observable<void> {
    return new Observable(observer => {
      this.generateHeaders().then(headers => {
        this.http.delete<void>(`${this.apiUrl}/${id}`, { headers }).subscribe(
          () => observer.next(),
          error => observer.error(error),
          () => observer.complete()
        );
      }).catch(error => observer.error(error));
    });
  }

  getMyReservations(): Observable<Reservation[]> {
    return new Observable(observer => {
      this.generateHeaders().then(headers => {
        const userId = this.getCurrentUserId();
        this.http.get<Reservation[]>(`${this.apiUrl}/user/${userId}`, { headers }).subscribe(
          data => observer.next(data),
          error => observer.error(error),
          () => observer.complete()
        );
      }).catch(error => observer.error(error));
    });
  }
}