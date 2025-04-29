import { Component, OnInit } from '@angular/core';
import { FormationService } from '../../services/farmingpractices.service';
import { ParticipationService } from '../../services/ParticipationService.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-farming-practice',
  templateUrl: './farming-practice.component.html',
  styleUrls: ['./farming-practice.component.css']
})
export class FarmingPracticeComponent implements OnInit {
  formations: any[] = [];
  filteredFormations: any[] = [];
  mesParticipations: any[] = [];
  blockTimes: { [idFormation: number]: number } = {}; // NEW
blockIntervals: { [idFormation: number]: any } = {}; // NEW

  types: string[] = ['THEORIQUE', 'PRATIQUE', 'MIXTE'];
  selectedType: string = 'ALL';
  searchTerm: string = '';

  calendarEvents: any[] = [];
  showCalendar: boolean = false;

  selectedFormation: any = null;
  modalVisible = false;
  cancelModalVisible = false;
  waitingModalVisible = false;
  waitingPosition: number | null = null;

  participationToCancel: number | null = null;
  formationToCancel: any = null;

  isLoading = false;
  participantsCount: { [idFormation: number]: number } = {};

  constructor(
    private formationService: FormationService,
    private participationService: ParticipationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.isLoading = true;
    forkJoin({
      formations: this.formationService.getAllFormations(),
      participations: this.participationService.getMesParticipations()
    }).subscribe({
      next: ({ formations, participations }) => {
        this.formations = formations;
        this.mesParticipations = participations || [];
        this.applyFilters();
        this.loadParticipantsCounts();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement initial', err);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredFormations = this.formations.filter(f => {
      const matchName = f.nom?.toLowerCase().includes(term);
      const matchType = this.selectedType === 'ALL' || f.typeFormation === this.selectedType;
      return matchName && matchType;
    });
    this.updateStatuses();
  }

  startBlockTimer(formationId: number): void {
    if (this.blockIntervals[formationId]) {
      clearInterval(this.blockIntervals[formationId]);
    }
  
    this.participationService.getRemainingBlockTime(formationId).subscribe({
      next: (timeLeftSeconds: number) => {  // déjà en secondes
        if (timeLeftSeconds > 0) {
          this.blockTimes[formationId] = timeLeftSeconds;
  
          // 🌟 METTRE formation._status à "BLOQUE" pendant le décompte
          const formation = this.filteredFormations.find(f => f.idFormation === formationId);
          if (formation) {
            formation._status = 'BLOQUE';
          }
  
          this.blockIntervals[formationId] = setInterval(() => {
            this.blockTimes[formationId]--;
  
            if (this.blockTimes[formationId] <= 0) {
              clearInterval(this.blockIntervals[formationId]);
              delete this.blockIntervals[formationId];
              delete this.blockTimes[formationId];
  
              // 🌟 Quand le timer arrive à 0 ➔ mettre formation._status à null pour débloquer
              const formation = this.filteredFormations.find(f => f.idFormation === formationId);
              if (formation) {
                formation._status = null;
              }
            }
          }, 1000);
        }
      },
      error: (err: any) => {
        console.error('Erreur récupération temps blocage', err);
      }
    });
  }
  
  
  
  updateStatuses(): void {
    for (let formation of this.filteredFormations) {
      const participation = this.mesParticipations.find(p =>
        p.formation?.idFormation === formation.idFormation
      );
  
      if (participation) {
        if (participation.bloque) {
          formation._status = 'BLOQUE';
          this.startBlockTimer(formation.idFormation);
        } else {
          formation._status = participation.enAttente ? 'WAITING' : 'INSCRIT';
        }
        formation._participationId = participation.idParticipation;
        formation._waitingPosition = participation.waitingPosition || null;
      } else {
        this.participationService.checkUserBlocked(formation.idFormation).subscribe({
          next: (isBlocked) => {
            if (isBlocked) {
              formation._status = 'BLOQUE';
              this.startBlockTimer(formation.idFormation); // 🌟 NEW
            } else {
              formation._status = null;
            }
          },
          error: (err) => {
            console.error('Erreur lors de la vérification du blocage', err);
            formation._status = null;
          }
        });
  
        formation._participationId = null;
        formation._waitingPosition = null;
      }
    }
  }
  
  loadParticipantsCounts(): void {
    this.formations.forEach(f => {
      this.participationService.getConfirmedParticipants(f.idFormation).subscribe(count => {
        this.participantsCount[f.idFormation] = count;
      });
    });
  }

  filterByType(): void {
    this.applyFilters();
  }

  searchByName(): void {
    this.applyFilters();
  }

  openParticipationModal(formation: any): void {
    this.selectedFormation = formation;
    this.isLoading = true;

    this.participationService.checkConflict(formation.idFormation).subscribe({
      next: (conflictingFormation) => {
        this.isLoading = false;
        if (conflictingFormation) {
          const message = `
⚠️ Vous êtes déjà inscrit à une formation sur la même période :

📚 Formation : ${conflictingFormation.nom}
📍 Lieu : ${conflictingFormation.lieu}
📅 Du ${conflictingFormation.dateDebut} au ${conflictingFormation.dateFin}

Souhaitez-vous continuer ?
          `;
          let snack = this.snackBar.open(message, 'Continuer', {
            duration: 8000,
            panelClass: ['conflict-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });

          snack.onAction().subscribe(() => {
            this.modalVisible = true;
          });
        } else {
          this.modalVisible = true;
        }
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Erreur de vérification.', '', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  closeParticipationModal(): void {
    this.modalVisible = false;
    this.selectedFormation = null;
  }

  openWaitingListModal(formation: any): void {
    this.selectedFormation = formation;
    this.isLoading = true;
    this.participationService.getWaitingPosition(formation.idFormation).subscribe({
      next: (position) => {
        this.waitingPosition = position;
        this.waitingModalVisible = true;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Erreur liste d\'attente.', '', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  closeWaitingListModal(): void {
    this.waitingModalVisible = false;
    this.waitingPosition = null;
    this.selectedFormation = null;
  }

  confirmParticipation(): void {
    if (!this.selectedFormation) return;
    this.isLoading = true;

    this.participationService.participer(this.selectedFormation.idFormation).subscribe({
      next: () => {
        this.loadAllData();
        this.closeParticipationModal();
        this.closeWaitingListModal();
        this.isLoading = false;
        this.snackBar.open('🎉 Inscription réussie !', '', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Erreur d\'inscription.', '', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.closeParticipationModal();
        this.closeWaitingListModal();
      }
    });
  }

  openCancelModal(participationId: number, formation: any): void {
    this.participationToCancel = participationId;
    this.formationToCancel = formation;
    this.cancelModalVisible = true;
  }

  closeCancelModal(): void {
    this.cancelModalVisible = false;
    this.participationToCancel = null;
    this.formationToCancel = null;
  }

  confirmCancel(): void {
    if (!this.participationToCancel) return;
    this.isLoading = true;

    this.participationService.annulerParticipation(this.participationToCancel).subscribe({
      next: () => {
        this.closeCancelModal();
        setTimeout(() => this.loadAllData(), 400);
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;

        const messageErreur = typeof err.error === 'string' ? err.error : '';
        
        if (messageErreur.includes('24h')) {
          this.snackBar.open('⏳ Impossible d\'annuler : moins de 24h avant la formation.', '', {
            duration: 6000,
            panelClass: ['warning-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        } else {
          this.snackBar.open('Erreur lors de l\'annulation.', '', {
            duration: 3000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        }

        this.closeCancelModal();
      }
    });
  }

  getImagePath(photoPath: string): string {
    return `http://localhost:8081/${photoPath}`;
  }

  showCalendarPopup(): void {
    this.formationService.getFormationsForCalendar().subscribe(formations => {
      this.calendarEvents = formations.map(f => ({
        title: f.title, // ✅ pas f.nom
        start: f.start, // ✅ pas f.dateDebut
        end: f.end,     // ✅ pas f.dateFin
        extendedProps: {
          idFormation: f.id // ✅ pas f.idFormation
        }
      }));
      this.showCalendar = true;
    });
  }
  
}
