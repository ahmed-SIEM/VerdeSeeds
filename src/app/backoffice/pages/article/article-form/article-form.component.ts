import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Article, ArticleService } from '../services/article.service';

@Component({
  selector: 'app-article-form',
  templateUrl: './article-form.component.html',
})
export class ArticleFormComponent implements OnInit {
  article: Article = {
    id: 0,
    title: '',
    description: '',
    imageUrl: '',
    pricePerHour: 0,
    isAvailable: true,
    typeArticle: 'RESERVATION', // Default value
    createdAt: '',
    prix: 0,
  };
  isEdit = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService
  ) {}

  ngOnInit(): void {
    // Check if an article ID is present in the URL (edit mode)
    const articleId = this.route.snapshot.paramMap.get('id');
    if (articleId) {
      this.isEdit = true;
      this.getArticle(Number(articleId)); // Fetch the article to edit
    }
  }

  // Fetch the article by ID for editing
  getArticle(id: number): void {
    this.articleService.getArticleById(id).subscribe({
      next: (data) => {
        this.article = data;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de l\'article', error);
      },
    });
  }

  

  onSubmit(): void {
    if (this.isEdit) {
      this.articleService.updateArticle(this.article).subscribe({
        next: () => {
          this.router.navigate(['/backoffice/articles']);
        },
        error: (error) => {
          console.error('Erreur lors de la modification de l\'article', error);
          alert(`Erreur: ${error.message || 'Une erreur est survenue.'}`);
        },
      });
    } else {
      this.articleService.addArticle(this.article).subscribe({
        next: () => {
          this.router.navigate(['/backoffice/articles']);
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout de l\'article', error);
          alert(`Erreur: ${error.message || 'Une erreur est survenue.'}`);
        },
      });
    }
  }
}