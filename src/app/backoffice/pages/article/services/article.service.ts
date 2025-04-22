import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface Article {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  pricePerHour: number;
  isAvailable: boolean;
  typeArticle: string;
  createdAt: string;
  prix: number;
}

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = 'http://localhost:8081/api/articles'; // adapte selon ton backend

  constructor(private http: HttpClient) {}

  // Récupérer tous les articles
  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.apiUrl);
  }

  // Récupérer un seul article par ID
  getArticleById(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`);
  }

  // Supprimer un article
  deleteArticle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Ajouter un article
  addArticle(article: Article): Observable<Article> {
    return this.http.post<Article>(this.apiUrl, article);
  }

  // Modifier un article
  updateArticle(article: Article): Observable<Article> {
    return this.http.put<Article>(`${this.apiUrl}/${article.id}`, article).pipe(
      tap((updatedArticle) => {
        console.log('Article mis à jour:', updatedArticle);
      })
    );
  }
  
}
