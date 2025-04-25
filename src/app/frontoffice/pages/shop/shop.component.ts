import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Article, ArticleService } from '../../../backoffice/pages/article/services/article.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  articles: Article[] = [];
  displayedArticles: Article[] = [];
  currentFilter: 'all' | 'available' | 'unavailable' = 'all';

  constructor(
    private articleService: ArticleService,
    private router: Router
  ) {
    console.log('ShopComponent constructed');
  }

  ngOnInit() {
    console.log('ShopComponent initialized');
    this.loadArticles();
  }

  loadArticles() {
    console.log('Starting to load articles...');
    this.articleService.getArticles().subscribe({
      next: (articles) => {
        this.articles = articles
          .filter(article => article.typeArticle?.toUpperCase() === 'RESERVATION')
          .map(article => ({
            ...article,
            isAvailable: article.hasOwnProperty('hasReservations') ? 
                        !article['hasReservations'] : 
                        article.hasOwnProperty('available') ? 
                        article['available'] : 
                        true
          }));
        this.applyFilter('all');
      },
      error: (error) => {
        console.error('Error loading articles:', error);
        console.error('Error details:', {
          status: error.status,
          message: error.message,
          error: error.error
        });
      },
      complete: () => {
        console.log('Articles loading completed');
      }
    });
  }

  applyFilter(filter: 'all' | 'available' | 'unavailable') {
    this.currentFilter = filter;
    switch (filter) {
      case 'available':
        this.displayedArticles = this.articles.filter(article => article.isAvailable);
        break;
      case 'unavailable':
        this.displayedArticles = this.articles.filter(article => !article.isAvailable);
        break;
      default:
        this.displayedArticles = [...this.articles];
    }
  }

  navigateToCalendar(articleId: string | number) {
    this.router.navigate([`/frontoffice/shop/article/${articleId}/calendar`]);
  }
}
