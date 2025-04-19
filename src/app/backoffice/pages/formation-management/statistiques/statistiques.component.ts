import { Component, OnInit } from '@angular/core';
import { StatistiqueService } from '../services/StatistiqueService.service';

@Component({
  selector: 'app-statistiques',
  templateUrl: './statistiques.component.html'
})
export class StatistiquesComponent implements OnInit {
  totalFormations: number = 0;
  certifiantes: number = 0;
  moyenneCapacite: number = 0;
  sansDetails: number = 0;

  constructor(private statService: StatistiqueService) {}

  ngOnInit(): void {
    this.statService.getTotalFormations().subscribe(data => this.totalFormations = data);
    this.statService.getFormationsCertifiantes().subscribe(data => this.certifiantes = data);
    this.statService.getMoyenneCapacite().subscribe(data => this.moyenneCapacite = data);
    this.statService.getFormationsSansDetails().subscribe(data => this.sansDetails = data);
  }
}
