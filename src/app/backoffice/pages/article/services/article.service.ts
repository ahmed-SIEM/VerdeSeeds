import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface Article {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  pricePerHour: number;
  isAvailable?: boolean;
  hasReservations?: boolean;
  available?: boolean;
  typeArticle: string;
  createdAt: string;
  prix: number;
  isActive?: boolean;
  auction?: any; // Rendre auction optionnel
}

enum PaymentType {
  CASH = 'CASH',
  CARD = 'CARD',
  TRANSFER = 'TRANSFER'
}

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = 'http://localhost:8081/api/articles'; // adapte selon ton backend

  constructor(private http: HttpClient) {}

  getArticles(): Observable<Article[]> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<Article[]>(this.apiUrl, { headers }).pipe(
          tap({
            next: (articles) => console.log('ArticleService: Received articles:', articles),
            error: (error) => console.error('ArticleService: Error fetching articles:', error)
          })
        )
      )
    );
  }

  getArticleById(id: number): Observable<Article> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<Article>(`${this.apiUrl}/${id}`, { headers })
      )
    );
  }

  deleteArticle(id: number): Observable<void> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.delete<void>(`${this.apiUrl}/${id}`, { headers })
      )
    );
  }

  addArticle(article: Article): Observable<Article> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.post<Article>(this.apiUrl, article, { headers })
      )
    );
  }

  updateArticle(article: Article): Observable<Article> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.put<Article>(`${this.apiUrl}/${article.id}`, article, { headers }).pipe(
          tap((updatedArticle) => console.log('Article mis à jour:', updatedArticle))
        )
      )
    );
  }

  searchArticle(title: string): Observable<Article[]> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<Article[]>(`${this.apiUrl}/articlesearch?title=${title}`, { headers })
      )
    );
  }

  getArticlesByAvailabilityAndType(available: boolean, type: PaymentType): Observable<Article[]> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<Article[]>(`${this.apiUrl}/by-availability-and-type`, {
          headers,
          params: {
            available: available.toString(),
            type: type
          }
        }).pipe(
          tap({
            next: (articles) => console.log('Articles récupérés par disponibilité et type:', articles),
            error: (error) => console.error('Erreur lors de la récupération des articles:', error)
          })
        )
      )
    );
  }

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
}
/* 
// participation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParticipationService {
  private apiUrl = ${environment.apiUrl}/participations;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: Bearer ${token},
      'Content-Type': 'application/json'
    });
  }

  participer(formationId: number): Observable<any> {
    return this.http.post<any>(
      ${this.apiUrl}/inscrire,
      { formationId }, // OK avec DTO Java
      { headers: this.getHeaders() }
    );
  }

  getMesParticipations(): Observable<any[]> {
    return this.http.get<any[]>(${this.apiUrl}/mes-participations, {
      headers: this.getHeaders()
    });
  }

  annulerParticipation(idParticipation: number): Observable<void> {
    return this.http.delete<void>(${this.apiUrl}/annuler/${idParticipation}, {
      headers: this.getHeaders()
    });
  }

  getWaitingPosition(formationId: number): Observable<number> {
    return this.http.get<number>(${this.apiUrl}/waiting-position/${formationId}, {
      headers: this.getHeaders()
    });
  }
  getConfirmedParticipants(formationId: number): Observable<number> {
    return this.http.get<number>(http://localhost:8081/participations/count-confirmed/${formationId});
  }

  checkConflict(formationId: number): Observable<any> {
    return this.http.get<any>(${this.apiUrl}/check-conflict/${formationId}, {
      headers: this.getHeaders()
    });
  }

  checkUserBlocked(formationId: number): Observable<boolean> {
    return this.http.get<boolean>(${this.apiUrl}/check-blocked/${formationId}, {
      headers: this.getHeaders()
    });
  }
  
  getRemainingBlockTime(formationId: number): Observable<number> {
    return this.http.get<number>(${this.apiUrl}/remaining-block-time/${formationId}, {
      headers: this.getHeaders()
    });
  }

  isAlreadyParticipating(formationId: number): Observable<boolean> {
    return this.http.get<boolean>(${this.apiUrl}/is-participating/${formationId}, {
      headers: this.getHeaders()
    });
  }
} */