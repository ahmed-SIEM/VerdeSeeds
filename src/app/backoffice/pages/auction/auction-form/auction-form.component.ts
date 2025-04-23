import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuctionService } from '../../article/services/auction.service';
import { switchMap } from 'rxjs/operators';
import { ArticleService } from '../../article/services/article.service';

@Component({
  selector: 'app-auction-form',
  templateUrl: './auction-form.component.html',
  styleUrls: ['./auction-form.component.css']
})
export class AuctionFormComponent implements OnInit {
  navigateToAuctions() {
    this.router.navigate(['/backoffice/auctions']);
  }
  selectedArticleTitle: string = '';
  auctionForm: FormGroup;
  isEditMode = false;
  articleId?: number;
  articles: any[] = [];
  selectedArticleId: number = 0;

  constructor(
    private fb: FormBuilder,
    private auctionService: AuctionService,
    private articleService: ArticleService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.auctionForm = this.fb.group({
      startPrice: ['', [Validators.required, Validators.min(0)]],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      active: [true]
    });
  }

  ngOnInit(): void {
    this.loadArticle();
  ;

    this.route.params.pipe(
      switchMap(params => {
      if (params['auctionId']) {
        this.isEditMode = true;
        return this.auctionService.getAuctionById(+params['auctionId']);
      }
      return [null];
      })
    ).subscribe(auction => {
      if (auction) {
      this.articleId = auction.articleId;
      if (this.articleId !== undefined) {
        this.articleService.getArticleById(this.articleId).subscribe((article) => {
        this.selectedArticleTitle = article.title;
        });
      }

      this.auctionForm.patchValue({
        startPrice: auction.startPrice,
        startTime: new Date(auction.startTime).toISOString().substring(0, 16),
        endTime: new Date(auction.endTime).toISOString().substring(0, 16),
        active: auction.active
      });
      }
    });
  }

  loadArticle(): void {
    this.articleService.getArticles().subscribe({
      next: (data) => {
        this.articles = data.filter((article: any) => article.typeArticle === 'AUCTION' && !article.auction);
        console.log('Auction Articles:', this.articles);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des articles', error);
      },
    });
  }

  onArticleSelect(event: any): void {
    this.selectedArticleId = parseInt(event.target.value);
  }

  onSubmit(): void {
    if (this.auctionForm.valid) {
      const auctionData = this.auctionForm.value;

      if (this.isEditMode) {
        const auctionId = +this.route.snapshot.params['id'];
        this.auctionService.updateAuction(auctionId, auctionData).subscribe(() => {
          this.router.navigate(['/backoffice/auctions']);
        });
      } else {
        this.auctionService.createAuction(auctionData, this.selectedArticleId).subscribe(() => {
          this.router.navigate(['/backoffice/auctions']);
        });
      }
    }
  }
}