import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuctionService } from '../../article/services/auction.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-auction-form',
  templateUrl: './auction-form.component.html',
  styleUrls: ['./auction-form.component.css']
})
export class AuctionFormComponent implements OnInit {
navigateToAuctions() {
throw new Error('Method not implemented.');
}
  auctionForm: FormGroup;
  isEditMode = false;
  articleId?: number;

  constructor(
    private fb: FormBuilder,
    private auctionService: AuctionService,
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
    this.route.queryParams.subscribe(params => {
      this.articleId = params['articleId'];
    });

    this.route.params.pipe(
      switchMap(params => {
        if (params['id']) {
          this.isEditMode = true;
          return this.auctionService.getAuctionById(+params['id']);
        }
        return [null];
      })
    ).subscribe(auction => {
      if (auction) {
        this.auctionForm.patchValue({
          startPrice: auction.startPrice,
          startTime: new Date(auction.startTime).toISOString().substring(0, 16),
          endTime: new Date(auction.endTime).toISOString().substring(0, 16),
          active: auction.active
        });
      }
    });
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
        if (this.articleId) {
          auctionData.articleId = this.articleId;
        }
        this.auctionService.createAuction(auctionData).subscribe(() => {
          this.router.navigate(['/backoffice/auctions']);
        });
      }
    }
  }
}