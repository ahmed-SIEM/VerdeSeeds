import { Component,OnInit } from '@angular/core';
import { PlateformeService } from 'src/app/services/plateforme/plateforme.service';

@Component({
  selector: 'app-platform-management',
  templateUrl: './platform-management.component.html',
  styleUrls: ['./platform-management.component.css']
})
export class PlatformManagementComponent implements OnInit {
  plateformes: any[] = [];

  constructor(private ps: PlateformeService) {}

  ngOnInit() {
    this.ps.getPlateforms().subscribe({
      next: (data) => {
        this.plateformes = data;
        console.log('plteformes récupérés :', this.plateformes);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des plteformes', error);
      }
    });
  }
}
