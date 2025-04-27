import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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
    const articleId = this.route.snapshot.paramMap.get('articleId');
    if (articleId) {
      this.router.navigate([`/backoffice/auctions/article/${articleId}`]);
    } else {
      this.router.navigate(['/backoffice/auctions']);
    }
  }
  selectedArticleTitle: string = '';
  auctionForm: FormGroup;
  isEditMode = false;
  articleId?: number;
  articles: any[] = [];
  selectedArticleId: number = 0;
  availableArticles: any[] = [];
  minimumPrice: number = 0;

  constructor(
    private fb: FormBuilder,
    private auctionService: AuctionService,
    private articleService: ArticleService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.auctionForm = this.fb.group({
      articleId: [''],
      startPrice: ['', [Validators.required, Validators.min(0), this.startPriceValidator()]],
      startTime: ['', [Validators.required, this.startDateValidator()]],
      endTime: ['', [Validators.required]],
      active: [true]
    }, { validators: this.dateRangeValidator.bind(this) });
  }

  // Fonction utilitaire pour normaliser les dates à la minute près
  private normalizeToMinute(date: Date): Date {
    const normalized = new Date(date);
    normalized.setSeconds(0, 0); // Met les secondes et millisecondes à 0
    return normalized;
  }

  // Validateur pour la date de début
  private startDateValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const startDate = this.normalizeToMinute(new Date(control.value));
      const now = this.normalizeToMinute(new Date());
      
      if (startDate < now) {
        return { 'pastDate': true };
      }
      return null;
    };
  }

  // Ajout du validateur pour le prix de départ
  private startPriceValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const startPrice = +control.value;
      if (startPrice < this.minimumPrice) {
        return { 'belowArticlePrice': true };
      }
      return null;
    };
  }

  // Validateur pour comparer les dates
  private dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const startTime = group.get('startTime')?.value;
    const endTime = group.get('endTime')?.value;

    if (startTime && endTime) {
      const startDate = this.normalizeToMinute(new Date(startTime));
      const endDate = this.normalizeToMinute(new Date(endTime));

      if (endDate <= startDate) {
        return { 'invalidDateRange': true };
      }
    }
    return null;
  }

  ngOnInit(): void {
    this.loadArticles();

    const auctionId = this.route.snapshot.paramMap.get('auctionId');
    const articleId = this.route.snapshot.paramMap.get('articleId');
    
    if (auctionId) {
      this.isEditMode = true;
      this.articleId = articleId ? +articleId : undefined;
      // Désactiver la validation de articleId en mode édition
      this.auctionForm.get('articleId')?.clearValidators();
      this.auctionForm.get('articleId')?.updateValueAndValidity();
      this.loadAuctionDetails(+auctionId);
    } else {
      // Ajouter la validation required pour articleId uniquement en mode création
      this.auctionForm.get('articleId')?.setValidators([Validators.required]);
      this.auctionForm.get('articleId')?.updateValueAndValidity();
    }
  }

  private loadAuctionDetails(auctionId: number): void {
    this.auctionService.getAuctionById(auctionId).subscribe({
      next: (auction) => {
        if (!auction) {
          console.error('Auction not found');
          this.router.navigate(['/backoffice/auctions']);
          return;
        }

        // Charge d'abord les détails de l'article
        if (this.articleId) {
          this.loadArticleDetails(this.articleId);
        }

        this.articleId = auction.articleId;
        if (this.articleId) {
          this.loadArticleDetails(this.articleId);
        }

        // Mettre à jour le formulaire en ajustant pour le timezone local
        this.auctionForm.patchValue({
          startPrice: auction.startPrice,
          startTime: new Date(auction.startTime).toISOString().slice(0, 16),
          endTime: new Date(auction.endTime).toISOString().slice(0, 16),
          active: auction.active
        });

        // Vérifier la validité du formulaire après le patch
        console.log('Form validity:', this.auctionForm.valid);
        console.log('Form value:', this.auctionForm.value);
        console.log('Form errors:', this.auctionForm.errors);
      },
      error: (error) => {
        console.error('Error loading auction:', error);
        // Show user-friendly error message
        alert('Une erreur est survenue lors du chargement de l\'enchère. Veuillez réessayer.');
        this.router.navigate(['/backoffice/auctions']);
      }
    });
  }

  private loadArticleDetails(articleId: number): void {
    console.log('Loading article details for ID:', articleId);
    this.articleService.getArticleById(articleId).subscribe({
      next: (article) => {
        console.log('Article loaded:', article);
        this.selectedArticleTitle = article.title;
      },
      error: (error) => {
        console.error('Error loading article details:', error);
        this.selectedArticleTitle = 'Article non trouvé';
      }
    });
  }

  loadArticles(): void {
    this.articleService.getArticles().subscribe({
      next: (data) => {
        this.availableArticles = data.filter((article: any) => {
          return article.typeArticle === 'AUCTION' && (!article.auction || !article.auction.active);
        });

        if (this.availableArticles.length === 0 && !this.isEditMode) {
          alert('Aucun article disponible pour une enchère.\nVeuillez d\'abord créer un article de type enchère.');
          this.router.navigate(['/backoffice/articles/new']);
        }
      },
      error: (error) => {
        console.error('Error loading articles:', error);
        alert('Erreur lors du chargement des articles.');
      }
    });
  }

  onArticleSelect(event: any): void {
    const selectedArticleId = parseInt(event.target.value);
    if (selectedArticleId) {
      this.articleService.getArticleById(selectedArticleId).subscribe({
        next: (article) => {
          if (article.prix) {
            this.minimumPrice = article.prix;
            this.auctionForm.patchValue({
              startPrice: article.prix
            });
            // Forcer la réévaluation de la validation
            this.auctionForm.get('startPrice')?.updateValueAndValidity();
          }
        },
        error: (error) => {
          console.error('Error loading article price:', error);
        }
      });
    }
  }

  startPriceBelowMinimum(): boolean {
    const startPrice = this.auctionForm.get('startPrice')?.value;
    return startPrice < this.minimumPrice;
  }

  onSubmit(): void {
    if (this.auctionForm.valid && !this.startPriceBelowMinimum()) {
      const formData = this.auctionForm.value;
      
      if (this.isEditMode) {
        const auctionId = +this.route.snapshot.params['auctionId'];
        const articleId = +this.route.snapshot.params['articleId'];
        
        // Convert form values and adjust for timezone
        const startTime = new Date(formData.startTime);
        const endTime = new Date(formData.endTime);
        
        const auctionData = {
          startPrice: +formData.startPrice,
          currentPrice: +formData.startPrice,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          active: Boolean(formData.active),
          articleId: articleId ? +articleId : undefined
        };

        console.log('Submitting auction update:', auctionData);

        this.auctionService.updateAuction(auctionId, auctionData).subscribe({
          next: () => {
            alert('Enchère mise à jour avec succès');
            if (articleId) {
              this.router.navigate([`/backoffice/auctions/article/${articleId}`]);
            } else {
              this.router.navigate(['/backoffice/auctions']);
            }
          },
          error: (error) => {
            console.error('Error updating auction:', error);
            alert(error.message || 'Une erreur est survenue lors de la mise à jour de l\'enchère.');
          }
        });
      } else {
        const selectedArticleId = this.auctionForm.get('articleId')?.value;
        if (!selectedArticleId) {
          alert('Veuillez sélectionner un article');
          return;
        }

        // Convert form values and adjust for timezone
        const startTime = new Date(formData.startTime);
        const endTime = new Date(formData.endTime);

        const newAuctionData = {
          startPrice: +formData.startPrice,
          currentPrice: +formData.startPrice,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          active: formData.active
        };

        this.auctionService.createAuction(newAuctionData, selectedArticleId).subscribe({
          next: () => {
            alert('Enchère créée avec succès');
            this.router.navigate(['/backoffice/auctions']);
          },
          error: (error) => {
            console.error('Error creating auction:', error);
            alert(error.message || 'Une erreur est survenue lors de la création de l\'enchère.');
          }
        });
      }
    }
  }
}