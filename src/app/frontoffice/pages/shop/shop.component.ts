import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Article, ArticleService } from '../../../backoffice/pages/article/services/article.service';
import { ReservationService } from '../../../backoffice/pages/article/services/reservation.service';

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
    private reservationService: ReservationService,
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
        const filteredArticles = articles.filter(article => 
          article.typeArticle?.toUpperCase() === 'RESERVATION'
        );

        if (filteredArticles.length === 0) {
          this.articles = [];
          this.applyFilter('all');
          return;
        }

        Promise.all(filteredArticles.map(article => 
          this.checkTodayAvailability(article)
        )).then(processedArticles => {
          this.articles = processedArticles.filter(article => article !== null);
          this.applyFilter('all');
        });
      },
      error: (error) => {
        console.error('Error loading articles:', error);
        this.articles = [];
        this.applyFilter('all');
      }
    });
  }

  private checkTodayAvailability(article: any): Promise<any> {
    return new Promise((resolve) => {
      this.reservationService.getReservationsByArticle(article.id).subscribe({
        next: (reservations) => {
          if (!reservations) {
            resolve({
              ...article,
              isAvailable: true
            });
            return;
          }

          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);

          const hasReservationsToday = reservations.some(res => {
            if (!res.startDatetime) return false;
            const startDate = new Date(res.startDatetime);
            return startDate >= today && startDate < tomorrow;
          });

          resolve({
            ...article,
            isAvailable: !hasReservationsToday
          });
        },
        error: () => {
          resolve({
            ...article,
            isAvailable: true
          });
        }
      });
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
