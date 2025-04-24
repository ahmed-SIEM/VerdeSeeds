import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuctionService, Auction } from '../../article/services/auction.service';

@Component({
  selector: 'app-auction-list',
  templateUrl: './auction-list.component.html',
})
export class AuctionListComponent implements OnInit {
  articleId?: number;
  auctions: Auction[] = [];
  isFromArticle: boolean = false; // Indicateur pour savoir si on vient de la page article

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auctionService: AuctionService
  ) {}

  ngOnInit(): void {
    const articleIdParam = this.route.snapshot.paramMap.get('articleId');
    if (articleIdParam) {
      this.articleId = +articleIdParam;
      this.isFromArticle = true;
      this.fetchArtictleAuctions();
    } else {
      this.fetchAuctions();
    }
  }

  fetchAuctions(): void {
    this.auctionService.getAllAuctions().subscribe({
      next: (data) => {
        // Make sure each auction has its articleId
        this.auctions = data.map(auction => ({
          ...auction,
          articleId: auction.article?.id // Use the article id from the auction object
        }));
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des enchères', error);
      },
    });
  }

  fetchArtictleAuctions(): void {
    this.auctionService.getAuctionsByArticle(this.articleId!).subscribe({
      next: (data) => {
        this.auctions = data.map(auction => ({
          ...auction,
          articleId: this.articleId
        }));
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des enchères', error);
      },
    });
  }

  deleteAuction(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette enchère ?')) {
      this.auctionService.deleteAuction(id).subscribe({
        next: () => this.fetchAuctions(),
        error: (error) => {
          console.error('Erreur lors de la suppression de l\'enchère', error);
        },
      });
    }
  }

  goToAddAuction(): void {
    this.router.navigate([`/backoffice/auctions/create`]);
  }

  goToEditAuction(auctionId: number): void {
    const articleId = this.route.snapshot.paramMap.get('articleId');
    if (articleId) {
      this.router.navigate([`/backoffice/auctions/article/${articleId}/edit/${auctionId}`]);
    } else {
      this.router.navigate([`/backoffice/auctions/article/${this.articleId}/edit/${auctionId}`]);
    }
  }
}
