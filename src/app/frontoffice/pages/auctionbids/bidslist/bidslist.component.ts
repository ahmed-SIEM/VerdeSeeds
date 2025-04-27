import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BidsService } from '../../../../backoffice/pages/article/services/bids.service';
import { Article, ArticleService } from '../../../../backoffice/pages/article/services/article.service';

@Component({
  selector: 'app-bidslist',
  templateUrl: './bidslist.component.html',
  styleUrls: ['./bidslist.component.css']
})
export class BidslistComponent implements OnInit {
  bids: any[] = [];
  article: Article | null = null;
  articleId: number = 0;
  newBidAmount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private bidsService: BidsService,
    private articleService: ArticleService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.articleId = +params['articleId'];
      this.loadArticleDetails();
      this.loadBids();
    });
  }

  loadArticleDetails() {
    this.articleService.getArticleById(this.articleId).subscribe({
      next: (article) => {
        this.article = article;
      },
      error: (error) => {
        console.error('Error loading article:', error);
      }
    });
  }

  loadBids() {
    this.bidsService.getBidsByAuction(this.articleId).subscribe({
      next: (bids) => {
        this.bids = bids.sort((a, b) => 
          new Date(b.bidTime).getTime() - new Date(a.bidTime).getTime()
        );
      },
      error: (error) => {
        console.error('Error loading bids:', error);
      }
    });
  }

  placeBid() {
    if (this.newBidAmount <= 0) return;

    const newBid = {
      bidAmount: this.newBidAmount,
      bidTime: new Date(),
      auction: {
        id: this.articleId
      }
    };

    this.bidsService.createBid(this.articleId, newBid).subscribe({
      next: () => {
        this.loadBids();
        this.newBidAmount = 0;
      },
      error: (error) => {
        console.error('Error placing bid:', error);
      }
    });
  }
}
