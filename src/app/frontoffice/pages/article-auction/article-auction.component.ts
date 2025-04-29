import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Article, ArticleService } from '../../../backoffice/pages/article/services/article.service';
import { AuctionService } from '../../../backoffice/pages/article/services/auction.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-article-auction',
  templateUrl: './article-auction.component.html',
  styleUrls: ['./article-auction.component.css']
})
export class ArticleAuctionComponent implements OnInit {
  currentDate: Date = new Date();
  articles: Article[] = [];
  displayedArticles: Article[] = [];
  currentFilter: 'all' | 'active' | 'closed' = 'all';

  constructor(
    private articleService: ArticleService,
    private auctionService: AuctionService,
    private router: Router
  ) {}

  ngOnInit() {
    // Update current time and check auctions every 30 seconds
    interval(30000).subscribe(() => {
      this.currentDate = new Date();
      this.checkAndFinalizeAuctions();
    });
    
    // Initial setup
    this.loadAuctionArticles();
    this.checkAndFinalizeAuctions();
  }

  loadAuctionArticles() {
    this.articleService.getArticles().subscribe({
      next: (articles) => {
        // Filtrer les articles de type AUCTION
        const auctionArticles = articles.filter(article => 
          article.typeArticle?.toUpperCase() === 'AUCTION'
        );
        
        // Pour chaque article, récupérer les détails de l'enchère
        const articlePromises = auctionArticles.map(article => {
          return this.auctionService.getAuctionsByArticle(article.id).toPromise()
            .then(auctions => {
              if (auctions && auctions.length > 0) {
                return {
                  ...article,
                  isActive: auctions[0].active,
                  auction: auctions[0]
                };
              }
              return {
                ...article,
                isActive: false,
                auction: null
              };
            });
        });

        // Attendre que toutes les promesses soient résolues
        Promise.all(articlePromises).then(completedArticles => {
          this.articles = completedArticles;
          this.applyFilter(this.currentFilter);
        });
      },
      error: (error) => {
        console.error('Error loading auction articles:', error);
      }
    });
  }

  applyFilter(filter: 'all' | 'active' | 'closed') {
    this.currentFilter = filter;
    switch (filter) {
      case 'active':
        this.displayedArticles = this.articles.filter(article => article.isActive);
        break;
      case 'closed':
        this.displayedArticles = this.articles.filter(article => !article.isActive);
        break;
      default:
        this.displayedArticles = [...this.articles];
    }
  }

  navigateToAuctionDetail(articleId: string | number) {
    this.auctionService.getAuctionsByArticle(+articleId).subscribe({
      next: (auctions) => {
        if (auctions && auctions.length > 0) {
          this.router.navigate([`/frontoffice/bids/auction/${auctions[0].id}`]);
        } else {
          console.error('No auction found for this article');
        }
      },
      error: (error) => {
        console.error('Error getting auction details:', error);
      }
    });
  }

  navigateToAddBid(articleId: string | number) {
    this.auctionService.getAuctionsByArticle(+articleId).subscribe({
      next: (auctions) => {
        if (auctions && auctions.length > 0) {
          this.router.navigate([`/frontoffice/bids/auction/${auctions[0].id}/new`]);
        } else {
          console.error('No auction found for this article');
        }
      },
      error: (error) => {
        console.error('Error getting auction details:', error);
      }
    });
  }

  getAuctionStatus(startTime?: string, endTime?: string): string {
    if (!startTime || !endTime) return 'pas denchere disponible';
    
    // Create Date objects and ensure they're treated as UTC
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    // Compare timestamps to avoid timezone issues
    if (now.getTime() < start.getTime()) {
      return 'Enchère prévue';
    } else if (now.getTime() > end.getTime()) {
      return 'Enchère terminée';
    } else if (now.getTime() >= start.getTime() && now.getTime() <= end.getTime()) {
      return 'Enchère en cours';
    }
    
    return 'Statut inconnu';
  }

  canAddBid(startTime?: string, endTime?: string): boolean {
    if (!startTime || !endTime) return false;
    
    // Create Date objects and ensure they're treated as UTC
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    // Compare timestamps to avoid timezone issues
    return now.getTime() >= start.getTime() && now.getTime() < end.getTime();
  }

  private checkAndFinalizeAuctions() {
    const now = new Date();
    this.articles.forEach(article => {
      if (article.auction && 
          article.auction.active && 
          new Date(article.auction.endTime) <= now) {
        console.log(`Attempting to finalize auction ${article.auction.id}`);
        this.auctionService.finalizeAuction(article.auction.id).subscribe({
          next: () => {
            console.log(`Auction ${article.auction.id} finalized successfully`);
            // Update the article status locally
            article.auction.active = false;
            // Mark the article as unavailable since it's been assigned to the winner
            article.available = false;
            // Refresh all articles to get the latest state
            this.loadAuctionArticles();
          },
          error: (error) => {
            console.error(`Error finalizing auction ${article.auction.id}:`, error);
            if (error.status === 404) {
              console.log('Auction may have already been finalized');
              // Refresh to get the current state
              this.loadAuctionArticles();
            }
          }
        });
      }
    });
  }
}
