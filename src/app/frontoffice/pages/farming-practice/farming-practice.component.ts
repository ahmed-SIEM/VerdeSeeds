import { Component, OnInit } from '@angular/core';
import { FormationService } from '../../services/farmingpractices.service';
import { ParticipationService } from '../../services/ParticipationService.service';
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
    private participationService: ParticipationService
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

  updateStatuses(): void {
    for (let formation of this.filteredFormations) {
      const participation = this.mesParticipations.find(p =>
        p.formation?.idFormation === formation.idFormation
      );

      if (participation) {
        formation._status = participation.enAttente ? 'WAITING' : 'INSCRIT';
        formation._participationId = participation.idParticipation;
        formation._waitingPosition = participation.waitingPosition || null; // 🌟 Important pour la file d'attente
      } else {
        formation._status = null;
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
    this.modalVisible = true;
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
      error: (err) => {
        console.error('Erreur récupération position attente', err);
        alert("Erreur de récupération de votre position en liste d'attente.");
        this.isLoading = false;
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
        this.loadAllData(); // 🔥 Recharge tout correctement
        this.closeParticipationModal();
        this.closeWaitingListModal();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur participation', err);
        alert('Erreur d\'inscription.');
        this.closeParticipationModal();
        this.closeWaitingListModal();
        this.isLoading = false;
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
      },
      error: (err) => {
        console.error('Erreur annulation', err);
        alert('Erreur lors de l\'annulation.');
        this.closeCancelModal();
        this.isLoading = false;
      }
    });
  }

  getImagePath(photoPath: string): string {
    return `http://localhost:8081/${photoPath}`;
  }

  showCalendarPopup(): void {
    this.formationService.getFormationsForCalendar().subscribe(events => {
      this.calendarEvents = events;
      this.showCalendar = true;
    });
  }
}
