import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

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
    console.log('ArticleService: Fetching articles from:', this.apiUrl);
    return this.http.get<Article[]>(this.apiUrl).pipe(
      tap({
        next: (articles) => console.log('ArticleService: Received articles:', articles),
        error: (error) => console.error('ArticleService: Error fetching articles:', error)
      })
    );
  }

  getArticleById(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`);
  }

  deleteArticle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addArticle(article: Article): Observable<Article> {
    return this.http.post<Article>(this.apiUrl, article);
  }

  updateArticle(article: Article): Observable<Article> {
    return this.http.put<Article>(`${this.apiUrl}/${article.id}`, article).pipe(
      tap((updatedArticle) => {
        console.log('Article mis à jour:', updatedArticle);
      })
    );
  }
  searchArticle(title: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/articlesearch?title=${title}`);
  }

  getArticlesByAvailabilityAndType(available: boolean, type: PaymentType): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/by-availability-and-type`, {
      params: {
        available: available.toString(),
        type: type
      }
    }).pipe(
      tap({
        next: (articles) => console.log('Articles récupérés par disponibilité et type:', articles),
        error: (error) => console.error('Erreur lors de la récupération des articles:', error)
      })
    );
  }
}
