import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ReservationService } from '../../../../backoffice/pages/article/services/reservation.service';
import { ArticleService } from '../../../../backoffice/pages/article/services/article.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  articleId!: number;
  articleTitle: string = '';
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth', // Changé de 'timeGridWeek' à 'dayGridMonth'
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    slotMinTime: '08:00:00',
    slotMaxTime: '20:00:00',
    events: [],
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    locale: 'fr',
    validRange: {
      start: new Date().toISOString().split('T')[0] // Désactive les dates antérieures à aujourd'hui
    }
  };

  constructor(
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    private articleService: ArticleService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.articleId = +params['articleId'];
      this.loadArticleAndReservations();
    });
  }

  loadArticleAndReservations() {
    this.articleService.getArticleById(this.articleId).subscribe({
      next: (article) => {
        this.articleTitle = article.title;
        this.loadReservations();
      },
      error: (error) => console.error('Error loading article:', error)
    });
  }

  loadReservations() {
    this.reservationService.getReservationsByArticle(this.articleId).subscribe({
      next: (reservations) => {
        const events = reservations.map(res => ({
          title: 'Réservé',
          start: new Date(res.startDatetime),
          end: new Date(res.endDatetime),
          backgroundColor: this.getStatusColor(res.status),
          borderColor: this.getStatusColor(res.status),
          extendedProps: {
            status: res.status
          }
        }));
        this.calendarOptions.events = events;
      },
      error: (error) => console.error('Error loading reservations:', error)
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'CONFIRMED': return '#28a745';
      case 'PENDING': return '#ffc107';
      case 'CANCELLED': return '#dc3545';
      default: return '#6c757d';
    }
  }

  handleDateSelect(selectInfo: any) {
    const startDate = selectInfo.start;
    const endDate = selectInfo.end;
    const now = new Date();
    
    // Vérification si la date sélectionnée est dans le passé
    if (startDate < now) {
      alert('Impossible de réserver une date dans le passé');
      return;
    }
    
    if (this.checkOverlap(startDate, endDate)) {
      alert('Cette plage horaire est déjà réservée');
      return;
    }

    if (confirm('Voulez-vous réserver cette plage horaire?')) {
      this.reservationService.createReservation(this.articleId, {
        startDatetime: startDate.toISOString(),
        endDatetime: endDate.toISOString(),
        status: 'PENDING'
      }).subscribe({
        next: () => this.loadReservations(),
        error: (error) => {
          console.error('Error creating reservation:', error);
          alert('Erreur lors de la création de la réservation');
        }
      });
    }
  }

  checkOverlap(start: Date, end: Date): boolean {
    const events = this.calendarOptions.events as any[];
    return events.some(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      return start < eventEnd && end > eventStart;
    });
  }
}
