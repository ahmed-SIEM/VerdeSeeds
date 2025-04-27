import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService, Reservation } from '../../article/services/reservation.service';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit {
  articleId?: number;
  reservations: Reservation[] = [];
  isFromArticle: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    const articleIdParam = this.route.snapshot.paramMap.get('articleId');
    if (articleIdParam) {
      this.articleId = +articleIdParam;
      this.isFromArticle = true;
      this.fetchReservationsByArticleId(this.articleId);
    } else {
      this.fetchAllReservations();
    }
  }

  getReservationStatusIcon(status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'): string {
    switch (status) {
      case 'PENDING':
        return '⏳ En attente';
      case 'CONFIRMED':
        return '✅ Confirmée';
      case 'CANCELLED':
        return '❌ Annulée';
      default:
        return '❓ Inconnu';
    }
  }

  fetchAllReservations(): void {
    this.reservationService.getAllReservations().subscribe({
      next: (data) => {
        this.reservations = data;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des réservations', error);
      }
    });
  }

  fetchReservationsByArticleId(articleId: number): void {
    this.reservationService.getReservationsByArticleId(articleId).subscribe({
      next: (data) => {
        this.reservations = data;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des réservations par article', error);
      }
    });
  }

  deleteReservation(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette réservation ?')) {
      this.reservationService.deleteReservation(id).subscribe({
        next: () => {
          this.reservations = this.reservations.filter(r => r.id !== id);
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de la réservation', error);
        }
      });
    }
  }

  goToAddReservation(): void {
    this.router.navigate(['/backoffice/reservations/create']);
  }

  goToEditReservation(reservationId: number): void {

      this.router.navigate([`/backoffice/reservations/article/${this.articleId}/edit/${reservationId}`]);
      console.log(`Navigating to edit reservation with ID ${reservationId} for article ID ${this.articleId}`);

  }
}
