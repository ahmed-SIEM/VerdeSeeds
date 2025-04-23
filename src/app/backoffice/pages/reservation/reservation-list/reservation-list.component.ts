import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService, Reservation } from '../../article/services/reservation.service';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit {

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
  
  articleId!: number;
  reservations: Reservation[] = [];
  isFromArticle: boolean = false; // Indicateur pour savoir si on vient de la page article

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.articleId = Number(this.route.snapshot.paramMap.get('articleId'));
    if (this.articleId) {
      this.isFromArticle = true;
      this.fetchReservationsByArticle();
    } else {
      this.fetchAllReservations();
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

  fetchReservationsByArticle(): void {
    this.reservationService.getReservationsByArticle(this.articleId).subscribe({
      next: (data) => {
        this.reservations = data;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des réservations', error);
      }
    });
  }

  deleteReservation(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette réservation ?')) {
      this.reservationService.deleteReservation(id).subscribe({
        next: () => {
          this.reservations = this.reservations.filter(reservation => reservation.id !== id);
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
    this.router.navigate([`/backoffice/reservations/edit/${reservationId}`]);
  }
}