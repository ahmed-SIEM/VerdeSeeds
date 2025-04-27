import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BidsService } from '../../../../backoffice/pages/article/services/bids.service';
import { AuctionService } from '../../../../backoffice/pages/article/services/auction.service';

@Component({
  selector: 'app-bidsform',
  templateUrl: './bidsform.component.html',
  styleUrls: ['./bidsform.component.css']
})
export class BidsformComponent implements OnInit, OnDestroy {
  bidForm: FormGroup;
  auctionId: number = 0;
  currentPrice: number = 0;
  errorMessage: string = '';
  timeLeft: string = '';
  endTime?: Date;
  timerInterval: any;
  isExpired: boolean = false;

  constructor(
    private fb: FormBuilder,
    private bidsService: BidsService,
    private auctionService: AuctionService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.bidForm = this.fb.group({
      bidAmount: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    const auctionIdParam = this.route.snapshot.paramMap.get('auctionId');
    if (auctionIdParam) {
      this.auctionId = +auctionIdParam;
      this.loadAuctionDetails();
    }
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  loadAuctionDetails() {
    this.auctionService.getAuctionById(this.auctionId).subscribe({
      next: (auction) => {
        this.currentPrice = auction.currentPrice || auction.startPrice;
        this.bidForm.get('bidAmount')?.setValidators([
          Validators.required,
          Validators.min(this.currentPrice + 1)
        ]);
        this.bidForm.get('bidAmount')?.updateValueAndValidity();
        
        // Set end time and start timer
        this.endTime = new Date(auction.endTime);
        this.startTimer();
      },
      error: (error) => {
        console.error('Error loading auction details:', error);
        this.errorMessage = 'Erreur lors du chargement des détails de l\'enchère';
      }
    });
  }

  startTimer() {
    if (!this.endTime) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const end = this.endTime!.getTime();
      const distance = end - now;

      if (distance <= 0) {
        this.timeLeft = 'TERMINÉ';
        this.isExpired = true;
        clearInterval(this.timerInterval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      this.timeLeft = `${days}j ${hours}h ${minutes}m ${seconds}s`;
    };

    // Initial call
    updateTimer();
    // Update timer every second
    this.timerInterval = setInterval(updateTimer, 1000);
  }

  onSubmit() {
    if (this.isExpired) {
      this.errorMessage = 'L\'enchère est terminée';
      return;
    }

    if (this.bidForm.valid) {
      const bidData = {
        bidAmount: this.bidForm.value.bidAmount,
        bidTime: new Date(),
        auctionId: this.auctionId
      };

      this.bidsService.createBid(this.auctionId, bidData).subscribe({
        next: () => {
          alert('Enchère placée avec succès!');
          this.router.navigate([`/frontoffice/articleauction`]);
        },
        error: (error) => {
          console.error('Error placing bid:', error);
          this.errorMessage = 'Erreur lors de la création de l\'enchère. Veuillez réessayer.';
        }
      });
    }
  }
}
