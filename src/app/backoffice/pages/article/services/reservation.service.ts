import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:8081/api/reservations';

  constructor(private http: HttpClient) {}
// i want the createreservation method to be with parameter articleId: number while updateReservation method to be with parameter articleTitle: string

  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl);
  }

  getReservationById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/${id}`);
  }

  getReservationsByArticle(articleId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/by-article/${articleId}`);
  }

  createReservation(articleId: number, reservationData: Partial<Reservation>): Observable<Reservation> {
    const url = `${this.apiUrl}/articles/${articleId}`;
    const payload = {
      ...reservationData,
      article: { id: articleId }
    };
    return this.http.post<Reservation>(url, payload);
  }

  updateReservation(articleId: number, reservationId: number, updatedReservation: Partial<Reservation>): Observable<Reservation> {
    console.log('Service - Updating reservation:', {articleId, reservationId, data: updatedReservation});
    const url = `${this.apiUrl}/articles/${articleId}/reservations/${reservationId}`;
    return this.http.put<Reservation>(url, updatedReservation);
  }
  
  getReservationsByArticleId(articleId: number): Observable<Reservation[]> {
    const url = `${this.apiUrl}/by-article/${articleId}`;
    return this.http.get<Reservation[]>(url);
  }
  getReservationsByArticleTitle(articleTitle: string): Observable<Reservation[]> {
    const url = `${this.apiUrl}/articles/${encodeURIComponent(articleTitle)}/reservations`;
    return this.http.get<Reservation[]>(url);
  }
  
  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}