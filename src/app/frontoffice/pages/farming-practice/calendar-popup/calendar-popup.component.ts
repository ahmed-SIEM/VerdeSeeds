import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ParticipationService } from '../../../services/ParticipationService.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-calendar-popup',
  templateUrl: './calendar-popup.component.html',
  styleUrls: ['./calendar-popup.component.css']
})
export class CalendarPopupComponent implements OnInit {
  @Input() events: any[] = [];
  @Output() closePopup = new EventEmitter<void>();

  calendarOptions!: CalendarOptions;
  selectedEvent: any = null;
  confirmParticipationModalVisible: boolean = false;

  constructor(
    private participationService: ParticipationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: ''
      },
      events: this.events,
      eventClick: (info) => {
        this.selectedEvent = {
          idFormation: info.event.extendedProps?.['idFormation'], // ✅ corrigé ici
          title: info.event.title,
          start: info.event.startStr,
          end: info.event.endStr
        };
      }
    };
  }

  close(): void {
    this.closePopup.emit();
  }

  openConfirmParticipation() {
    if (!this.selectedEvent) return;
  
    const formationId = this.selectedEvent.idFormation;
  
    this.participationService.isAlreadyParticipating(formationId).subscribe({
      next: (alreadyParticipating) => {
        if (alreadyParticipating) {
          this.snackBar.open('⚠️ Vous êtes déjà inscrit à cette formation.', '', {
            duration: 4000,
            panelClass: ['warning-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            politeness: 'polite',
          });
          this.selectedEvent = null;
        } else {
          this.confirmParticipationModalVisible = true;
        }
      },
      error: (error) => {
        console.error('Erreur lors de la vérification de la participation', error);
        this.snackBar.open('Erreur lors de la vérification.', '', {
          duration: 3000,
          panelClass: ['error-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      }
    });
  }

  cancelParticipationAction() {
    this.confirmParticipationModalVisible = false;
  }

  confirmParticipationAction() {
    this.participateInSelectedFormation();
    this.confirmParticipationModalVisible = false;
  }
  participateInSelectedFormation() {
    if (!this.selectedEvent?.idFormation) {
      console.error('Formation ID manquant');
      return;
    }
  
    const formationId = this.selectedEvent.idFormation;
  
    this.participationService.participer(formationId).subscribe({
      next: () => {
        this.snackBar.open('✅ Inscription réussie !', '', {
          duration: 3000,
          panelClass: ['success-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
        window.location.href = '/frontoffice/farmingpractice'; // 🛠️ changé ici
      },
      error: (error) => {
        const messageErreur = typeof error.error === 'string' ? error.error : '';
        if (messageErreur.includes('déjà inscrit') || messageErreur.includes('déjà participé')) {
          this.snackBar.open('⚠️ Vous êtes déjà inscrit à cette formation.', '', {
            duration: 4000,
            panelClass: ['warning-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        } else {
          this.snackBar.open('Erreur lors de l\'inscription 😢', '', {
            duration: 3000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        }
      }
    });
  }
}
