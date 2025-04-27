import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Article, ArticleService } from '../services/article.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listearticle',
  templateUrl: './list-article.component.html',
  styleUrls: ['./list-article.component.css']
})
export class ListearticleComponent implements OnInit, OnDestroy {
  articles: Article[] = [];
  searchTerm: string = '';
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  constructor(
    private articleService: ArticleService,
    private router: Router
  ) {
    this.setupSearch();
  }

  private setupSearch(): void {
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      if (term.trim()) {
        this.articleService.searchArticle(term).subscribe({
          next: (results) => this.articles = results,
          error: (err) => console.error('Erreur lors de la recherche:', err)
        });
      } else {
        this.loadArticles();
      }
    });
  }

  onSearchInput(event: any): void {
    this.searchSubject.next(event.target.value);
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

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
