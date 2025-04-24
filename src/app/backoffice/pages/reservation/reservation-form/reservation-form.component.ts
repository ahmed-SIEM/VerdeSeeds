import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../../article/services/reservation.service';
import { ArticleService } from '../../article/services/article.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css']
})
export class ReservationFormComponent implements OnInit {
  reservationForm!: FormGroup;
  isEditMode = false;
  articles: any[] = [];
  selectedArticleId: number = 0;
selectedArticleTitle: any;

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private articleService: ArticleService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.reservationForm = this.fb.group({
      articleId: ['', Validators.required],
      startDatetime: ['', Validators.required],
      endDatetime: ['', Validators.required],
      totalPrice: [{ value: 0, disabled: true }],
      status: ['PENDING', Validators.required]
    });

    this.articleService.getArticles().subscribe({
      next: (data) => {
        this.articles = data.filter((article: any) =>
          article.typeArticle === 'RESERVATION' && !article.reservation
        );
        
        // Récupérer les paramètres de l'URL
        this.route.params.subscribe(params => {
          if (params['articleId']) {
            this.selectedArticleId = +params['articleId'];
            console.log('Article ID from URL:', this.selectedArticleId);
          }
          
          if (params['reservationId']) {
            this.isEditMode = true;
            this.loadReservation(+params['reservationId']);
          }
        });
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des articles', error);
      }
    });

    this.reservationForm.get('startDatetime')?.valueChanges.subscribe(() => this.calculateTotalPrice());
    this.reservationForm.get('endDatetime')?.valueChanges.subscribe(() => this.calculateTotalPrice());
  }

  loadReservation(id: number): void {
    this.reservationService.getReservationById(id).subscribe({
      next: (reservation) => {
        console.log('Loaded reservation:', reservation);
        if (reservation) {
          // Utiliser l'ID de l'article de l'URL si disponible
          this.selectedArticleId = this.selectedArticleId || reservation.article?.id || 0;
          const selectedArticle = this.articles.find(article => article.id === this.selectedArticleId);
          this.selectedArticleTitle = selectedArticle?.title || '';
          
          this.reservationForm.patchValue({
            articleId: this.selectedArticleId,
            startDatetime: new Date(reservation.startDatetime).toISOString().substring(0, 16),
            endDatetime: new Date(reservation.endDatetime).toISOString().substring(0, 16),
            totalPrice: reservation.totalPrice,
            status: reservation.status
          });

          // Mettre à jour le calcul du prix
          this.calculateTotalPrice();
        }
      },
      error: (error) => {
        console.error('Error loading reservation:', error);
      }
    });
  }

  loadArticles(): void {
    this.articleService.getArticles().subscribe({
      next: (data) => {
        this.articles = data.filter((article: any) =>
          article.typeArticle === 'RESERVATION' && !article.reservation
        );
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des articles', error);
      }
    });
  }

  onArticleSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedArticleId = Number(selectElement.value);
    this.reservationForm.patchValue({ articleId: this.selectedArticleId });  // Ajouter cette ligne
    const selectedArticle = this.articles.find(article => article.id === this.selectedArticleId);
    this.selectedArticleTitle = selectedArticle?.title || '';
    this.calculateTotalPrice();

  }

  onSubmit(): void {
    if (this.reservationForm.valid) {
      const formValues = this.reservationForm.getRawValue();
      const reservationData = {
        startDatetime: new Date(formValues.startDatetime).toISOString(),
        endDatetime: new Date(formValues.endDatetime).toISOString(),
        status: formValues.status,
        article: { id: this.selectedArticleId }  // Ajouter l'ID de l'article
      };

      if (this.isEditMode) {
        const reservationId = +this.route.snapshot.params['reservationId'];
        console.log('Updating reservation with articleId:', this.selectedArticleId);
        
        this.reservationService.updateReservation(
          this.selectedArticleId,
          reservationId,
          reservationData
        ).subscribe({
          next: (response) => {
            console.log('Update successful:', response);
            this.router.navigate(['/backoffice/reservations']);
          },
          error: (error) => {
            console.error('Update failed:', error);
          }
        });
      } else {
        this.reservationService.createReservation(this.selectedArticleId, reservationData).subscribe({
          next: () => {
            this.router.navigate(['/backoffice/reservations']);
          },
          error: (error) => {
            console.error('Erreur lors de la création de la réservation', error);
          }
        });
      }
    }
  }

  calculateTotalPrice(): void {
    const startDatetime = this.reservationForm.get('startDatetime')?.value;
    const endDatetime = this.reservationForm.get('endDatetime')?.value;

    if (startDatetime && endDatetime) {
      const start = new Date(startDatetime);
      const end = new Date(endDatetime);
      const hours = Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60 * 60));

      const selectedArticle = this.articles.find(article => article.id === this.selectedArticleId);
      if (selectedArticle && selectedArticle.pricePerHour) {
        const totalPrice = hours * selectedArticle.pricePerHour;
        this.reservationForm.get('totalPrice')?.setValue(totalPrice);
      } else {
        this.reservationForm.get('totalPrice')?.setValue(0);
      }
    } else {
      this.reservationForm.get('totalPrice')?.setValue(0);
    }
  }

  getTotalPrice(): string {
    const totalPrice = this.reservationForm.get('totalPrice')?.value;
    return typeof totalPrice === 'number' ? totalPrice.toFixed(2) : '0.00';
  }

  navigateToReservations(): void {
    this.router.navigate(['/backoffice/reservations']);
  }

  // Ajouter cette méthode pour vérifier si le formulaire est valide
  isFormValid(): boolean {
    return this.reservationForm.valid && 
           (this.isEditMode || this.selectedArticleId > 0) &&
           this.reservationForm.get('startDatetime')?.value &&
           this.reservationForm.get('endDatetime')?.value;
  }
}
