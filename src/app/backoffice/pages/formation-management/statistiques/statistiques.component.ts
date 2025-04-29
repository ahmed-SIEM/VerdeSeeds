import { Component, OnInit } from '@angular/core';
import { StatistiqueService } from '../services/StatistiqueService.service';
import { ChartOptions, ChartDataset } from 'chart.js';

@Component({
  selector: 'app-statistiques',
  templateUrl: './statistiques.component.html'
})
export class StatistiquesComponent implements OnInit {
  totalFormations = 0;
  certifiantes = 0;
  moyenneCapacite = 0;
  sansDetails = 0;

  // Pie Chart
  pieChartLabels: string[] = ['Certifiantes', 'Non Certifiantes'];
  pieChartData: { labels: string[]; datasets: ChartDataset<'pie'>[] } = {
    labels: this.pieChartLabels,
    datasets: [{ data: [0, 0] }]
  };
  pieChartType: 'pie' = 'pie';
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Répartition des formations certifiantes' }
    }
  };

  // Bar Chart
  barChartLabels: string[] = ['Total Formations', 'Sans Détails'];
  barChartData: { labels: string[]; datasets: ChartDataset<'bar'>[] } = {
    labels: this.barChartLabels,
    datasets: [{ data: [0, 0], label: 'Formations' }]
  };
  barChartType: 'bar' = 'bar';
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Formations et Détails' }
    }
  };

  constructor(private statService: StatistiqueService) {}

  ngOnInit(): void {
    this.statService.getTotalFormations().subscribe(total => {
      this.totalFormations = total;
      this.updateCharts();
    });

    this.statService.getFormationsCertifiantes().subscribe(certif => {
      this.certifiantes = certif;
      this.updateCharts();
    });

    this.statService.getMoyenneCapacite().subscribe(moyenne => {
      this.moyenneCapacite = moyenne;
    });

    this.statService.getFormationsSansDetails().subscribe(sansDetails => {
      this.sansDetails = sansDetails;
      this.updateCharts();
    });
  }

  updateCharts(): void {
    this.pieChartData = {
      labels: this.pieChartLabels,
      datasets: [{ data: [this.certifiantes, this.totalFormations - this.certifiantes] }]
    };
    this.barChartData = {
      labels: this.barChartLabels,
      datasets: [{ data: [this.totalFormations, this.sansDetails], label: 'Formations' }]
    };
  }
}
