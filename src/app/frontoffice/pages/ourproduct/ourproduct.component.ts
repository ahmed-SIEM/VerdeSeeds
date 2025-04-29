import { Component, OnInit } from '@angular/core';
import { Article } from '../../../backoffice/pages/article/services/article.service';
import { BidsService } from '../../../backoffice/pages/article/services/bids.service';
import { ReservationService } from '../../../backoffice/pages/article/services/reservation.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-ourproduct',
  templateUrl: './ourproduct.component.html',
  styleUrls: ['./ourproduct.component.css']
})
export class OurproductComponent implements OnInit {
  userArticles: Article[] = [];
  loading = true;
  error = '';

  constructor(
    private bidsService: BidsService,
    private reservationService: ReservationService
  ) {}

  ngOnInit() {
    this.loadUserArticles();
  }

  private loadUserArticles() {
    const userId = this.getCurrentUserId();
    
    // Charger à la fois les articles gagnés aux enchères et les réservations
    forkJoin({
      wonArticles: this.bidsService.getWonArticlesByUser(userId),
      reservedArticles: this.reservationService.getMyReservations()
    }).subscribe({
      next: (result) => {
        // Combiner et dédupliquer les articles
        const allArticles = [...result.wonArticles];
        
        result.reservedArticles.forEach(reservation => {
          if (reservation.article && reservation.article.id !== undefined && !allArticles.find(a => a.id === reservation.article!.id)) {
            allArticles.push(reservation.article);
          }
        });
        
        this.userArticles = allArticles;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading user articles:', error);
        this.error = 'Erreur lors du chargement de vos articles';
        this.loading = false;
      }
    });
  }

  private getCurrentUserId(): number {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      throw new Error('User not authenticated');
    }
    return JSON.parse(userStr).idUser;
  }
}
