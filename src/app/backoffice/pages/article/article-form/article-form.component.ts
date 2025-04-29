import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Article, ArticleService } from '../services/article.service';
import { AIService } from '../services/ai.service';

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
    typeArticle: 'RESERVATION',
    createdAt: new Date().toISOString(),
    prix: 0,
    isActive: undefined,
    auction: undefined // Ajouter cette ligne
  };
  isEdit = false;
  isGenerating = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
    private aiService: AIService
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
    this.submitArticle();
  }

  private submitArticle(): void {
    if (this.isEdit) {
      this.articleService.updateArticle(this.article).subscribe({
        next: () => {
          this.router.navigate(['/backoffice/articles']);
        },
        error: (error: Error) => {
          console.error('Erreur lors de la modification de l\'article', error);
          alert(`Erreur: ${error.message || 'Une erreur est survenue.'}`);
        }
      });
    } else {
      this.articleService.addArticle(this.article).subscribe({
        next: () => {
          this.router.navigate(['/backoffice/articles']);
        },
        error: (error: Error) => {
          console.error('Erreur lors de l\'ajout de l\'article', error);
          alert(`Erreur: ${error.message || 'Une erreur est survenue.'}`);
        }
      });
    }
  }

  generateAIDescription(): void {
    if (!this.article.title) {
      alert('Veuillez remplir le titre avant de générer une description');
      return;
    }

    this.isGenerating = true;
    this.aiService.generateDescription(this.article.title).subscribe({
      next: (response: any) => {
        const generatedText = response.choices[0].message.content.trim();
        if (generatedText.startsWith('ERREUR:')) {
          alert('Le titre doit correspondre à un produit agricole.');
          this.isGenerating = false;
          return;
        }
        this.article.description = generatedText
          .replace(/^["']|["']$/g, '')
          .trim()
          .substring(0, 2000);
        this.isGenerating = false;
      },
      error: (error: Error) => {
        console.error('Erreur de génération:', error);
        alert(typeof error === 'string' ? error : 'Erreur lors de la génération de la description.');
        this.isGenerating = false;
      }
    });
  }
}