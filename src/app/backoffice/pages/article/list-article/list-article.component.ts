import { Component, OnInit } from '@angular/core';
import { Article, ArticleService } from '../services/article.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listearticle',
  templateUrl: './list-article.component.html',
  styleUrls: ['./list-article.component.css']
})
export class ListearticleComponent implements OnInit {
  articles: Article[] = [];

  constructor(
    private articleService: ArticleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.articleService.getArticles().subscribe({
      next: (data) => this.articles = data,
      error: (err) => console.error('Erreur lors du chargement des articles', err)
    });
  }

  deleteArticle(id: number): void {
    if (confirm('Confirmer la suppression de l’article ?')) {
      this.articleService.deleteArticle(id).subscribe({
        next: () => this.loadArticles(),
        error: (err) => console.error('Erreur lors de la suppression de l’article', err)
      });
    }
  }

  getImagePath(imageUrl: string): string {
    return `http://localhost:8081/${imageUrl}`;
  }

  trackById(index: number, article: Article): number {
    return article.id;
  }
}
