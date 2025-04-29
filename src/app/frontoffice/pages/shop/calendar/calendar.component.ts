import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ReservationService, Reservation } from '../../../../backoffice/pages/article/services/reservation.service';
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
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    timeZone: 'local',
    slotMinTime: '00:00:00',
    slotMaxTime: '23:59:59',
    events: [],
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    selectConstraint: {
      start: '00:00',
      end: '24:00',
    },
    select: this.handleDateSelect.bind(this),
    locale: 'fr',
    validRange: {
      start: new Date().toISOString().split('T')[0]
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
          title: res.user?.idUser ? `Réservé par User ${res.user.idUser}` : 'Réservé',
          start: new Date(res.startDatetime),
          end: new Date(res.endDatetime),
          backgroundColor: this.getStatusColor(res.status),
          borderColor: this.getStatusColor(res.status),
          extendedProps: {
            status: res.status,
            userId: res.user?.idUser
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

  checkOverlap(start: Date, end: Date): { overlaps: boolean; existingUserId?: number } {
    const events = this.calendarOptions.events as any[];
    for (const event of events) {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      if (start < eventEnd && end > eventStart) {
        return { overlaps: true, existingUserId: event.extendedProps.userId };
      }
    }
    return { overlaps: false };
  }

  private normalizeDate(date: Date): Date {
    const normalized = new Date(date);
    // Ajuster pour le fuseau horaire local
    normalized.setMinutes(normalized.getMinutes() + normalized.getTimezoneOffset());
    normalized.setSeconds(0, 0);
    return normalized;
  }

  private formatToLocalISOString(date: Date): string {
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
    return adjustedDate.toISOString();
  }

  handleDateSelect(selectInfo: any) {
    const startDate = new Date(selectInfo.start);
    const endDate = new Date(selectInfo.end);
    const now = new Date();
    
    console.log('Debug dates:', {
      originalStart: startDate.toISOString(),
      originalEnd: endDate.toISOString(),
      localStart: startDate.toLocaleString(),
      localEnd: endDate.toLocaleString(),
      timezoneOffset: startDate.getTimezoneOffset()
    });

    if (startDate.getTime() < now.getTime()) {
      alert('Impossible de réserver une date dans le passé');
      return;
    }

    const overlapCheck = this.checkOverlap(startDate, endDate);
    if (overlapCheck.overlaps) {
      const currentUser = this.getCurrentUser();
      if (!currentUser || currentUser.idUser !== overlapCheck.existingUserId) {
        alert('Cette plage horaire est déjà réservée par un autre utilisateur');
        return;
      }
    }

    if (confirm(`Voulez-vous réserver du ${startDate.toLocaleString()} au ${endDate.toLocaleString()} ?`)) {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        alert('Vous devez être connecté pour effectuer une réservation');
        return;
      }

      const reservationData: Partial<Reservation> = {
        startDatetime: this.formatToLocalISOString(startDate),
        endDatetime: this.formatToLocalISOString(endDate),
        status: 'PENDING' as const,
        user: { idUser: currentUser.idUser }
      };

      console.log('Sending reservation request with adjusted times:', {
        original: {
          start: startDate.toLocaleString(),
          end: endDate.toLocaleString()
        },
        adjusted: reservationData
      });

      this.reservationService.createReservation(this.articleId, reservationData).subscribe({
        next: () => {
          this.loadReservations();
          alert('Réservation créée avec succès');
        },
        error: (error) => {
          console.error('Erreur de réservation:', {
            error,
            sentData: reservationData
          });
          alert('Erreur lors de la création de la réservation');
        }
      });
    }
  }

  private getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
}
