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
  articleId?: number;
  articles: any[] = [];
  selectedArticleTitle: string = '';
  selectedArticleId: number = 0;

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private articleService: ArticleService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadArticles();

    this.route.params.pipe(
      switchMap(params => {
        if (params['reservationId']) {
          this.isEditMode = true;
          return this.reservationService.getReservationById(+params['reservationId']);
        }
        return [null];
      })
    ).subscribe(reservation => {
      if (reservation) {
        this.articleId = reservation.articleId; // Récupérer l'ID de l'article associé
        if (this.articleId !== undefined) {
          this.articleService.getArticleById(this.articleId).subscribe((article) => {
            this.selectedArticleTitle = article.title;
          });
        }

        this.reservationForm.patchValue({
          startDatetime: new Date(reservation.startDatetime).toISOString().substring(0, 16),
          endDatetime: new Date(reservation.endDatetime).toISOString().substring(0, 16),
          totalPrice: reservation.totalPrice,
          status: reservation.status
        });
      }
    });

    this.reservationForm = this.fb.group({
      startDatetime: ['', Validators.required],
      endDatetime: ['', Validators.required],
      totalPrice: ['', [Validators.required, Validators.min(0)]],
      status: ['PENDING', Validators.required] // Valeur par défaut : PENDING
    });
  }

  loadArticles(): void {
    this.articleService.getArticles().subscribe({
      next: (data) => {
        this.articles = data.filter((article: any) => !article.reservation); // Articles sans réservation
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des articles', error);
      }
    });
  }

  onArticleSelect(event: any): void {
    this.selectedArticleId = parseInt(event.target.value);
  }

  onSubmit(): void {
    if (this.reservationForm.valid) {
      const reservationData = {
        ...this.reservationForm.value,
        article: { id: this.selectedArticleId } // Ajouter l'article sélectionné
      };
  
      if (this.isEditMode) {
        const reservationId = +this.route.snapshot.params['reservationId'];
        this.reservationService.updateReservation(reservationId, reservationData).subscribe(() => {
          this.router.navigate(['/backoffice/reservations']);
        });
      } else {
        this.reservationService.createReservation(reservationData).subscribe(() => {
          this.router.navigate(['/backoffice/reservations']);
        });
      }
    }
  }

  navigateToReservations(): void {
    this.router.navigate(['/backoffice/reservations']);
  }
}