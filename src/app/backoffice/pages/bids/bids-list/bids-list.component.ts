import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BidsService, Bid } from '../../article/services/bids.service';

@Component({
  selector: 'app-bids-list',
  templateUrl: './bids-list.component.html',
  styleUrls: ['./bids-list.component.css']
})
export class BidsListComponent implements OnInit {
  auctionId?: number;
  bids: Bid[] = [];
  isFromAuction: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bidsService: BidsService
  ) {}

  ngOnInit(): void {
    const auctionIdParam = this.route.snapshot.paramMap.get('auctionId');
    if (auctionIdParam) {
      this.auctionId = +auctionIdParam;
      this.isFromAuction = true;
      this.fetchBidsByAuction(this.auctionId);
    } else {
      this.fetchAllBids();
    }
  }

  fetchAllBids(): void {
    this.bidsService.getAllBids().subscribe({
      next: (data) => {
        this.bids = data;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des enchères', error);
      }
    });
  }

  fetchBidsByAuction(auctionId: number): void {
    this.bidsService.getBidsByAuction(auctionId).subscribe({
      next: (data) => {
        this.bids = data;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des enchères pour cette auction', error);
      }
    });
  }

  deleteBid(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette enchère ?')) {
      this.bidsService.deleteBid(id).subscribe({
        next: () => {
          this.bids = this.bids.filter(b => b.id !== id);
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de l\'enchère', error);
        }
      });
    }
  }

  goToAddBid(): void {
    if (this.auctionId) {
      const articleId = this.route.snapshot.paramMap.get('articleId');
      this.router.navigate([`/backoffice/auctions/article/${articleId}/auction/${this.auctionId}/bids/create`]);
    }
  }

  goToEditBid(bidId: number): void {
    if (this.auctionId) {
      const articleId = this.route.snapshot.paramMap.get('articleId');
      this.router.navigate([`/backoffice/auctions/article/${articleId}/auction/${this.auctionId}/bids/edit/${bidId}`]);
    }
  }
}
