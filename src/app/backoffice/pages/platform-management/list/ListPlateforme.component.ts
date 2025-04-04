import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlateformeService } from 'src/app/services/plateforme/plateforme.service';
  

@Component({
  selector: 'app-Plateformelist',
  templateUrl: './Platformelist.component.html',
  styleUrls: ['./Platformelist.component.css']
})
export class ListPlateformeComponent implements OnInit {


  TypePack = {
    BASIC : 'BASIC',
    PREMIUM : 'PREMIUM',
    ENTERPRISE : 'ENTERPRISE'
  }
  plateformes: any[] = [];
  users: any[] = [];
  searchTerm: string = '';
  filterType: string = '';
  typePackOptions = Object.values(this.TypePack);
  selectedPlateforme: any = null;

  constructor(
    private ps: PlateformeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPlateformes();
    this.loadUsers();
  }

  get filteredPlatforms() {
    return this.plateformes.filter(platform => {
      const matchesSearch = !this.searchTerm || 
        platform.nomPlateforme.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        platform.description?.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesType = !this.filterType || platform.typePack === this.filterType;
      
      return matchesSearch && matchesType;
    });
  }

  loadPlateformes() {
    this.ps.getPlateforms().subscribe({
      next: (data) => {
        this.plateformes = data;
        console.log('Platforms loaded:', this.plateformes);
      },
      error: (error) => {
        console.error('Error loading platforms:', error);
      }
    });
  }

  loadUsers() {
    this.ps.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  createOrUpdatePlateforme(): void {
    if (this.selectedPlateforme.idPlateforme) {
      this.ps.updatePlateforme( this.selectedPlateforme).subscribe({
        next: () => this.loadPlateformes(),
        error: (err) => console.error('Erreur lors de la mise à jour de la plateforme', err)
      });
    } else {
      this.ps.createPlateforme(this.selectedPlateforme).subscribe({
        next: () => this.loadPlateformes(),
        error: (err) => console.error('Erreur lors de la création de la plateforme', err)
      });
    }
    this.selectedPlateforme = null;
  }

  addplateforme(){
    this.router.navigate(['/backoffice/platform', 'new']);

  }

  editPlateforme(platform: any) {
    this.router.navigate(['/backoffice/platform', platform.idPlateforme, 'edit']);
  }

  viewPlateforme(platform: any) {
    this.router.navigate(['/backoffice/platform', platform.idPlateforme]);
  }

  previewPlateforme(platform: any) {
    console.log('Previewing platform:', platform);
     //preview logic here
  }

  deletePlateforme(id: number) {
    if (confirm('Are you sure you want to delete this platform?')) {
      this.ps.deletePlateforme(id).subscribe({
        next: () => {
          this.loadPlateformes();
        },
        error: (error) => {
          console.error('Error deleting platform:', error);
        }
      });
    }
  }


  isExpired(date: string): boolean {
    const currentDate = new Date();
    const expirationDate = new Date(date);
    return expirationDate < currentDate;
  }

  navigateToEdit(id: number): void {
    this.router.navigate([`/backoffice/platform/${id}/edit`]);
  }

  navigateToCreate(): void {
    this.router.navigate(['/backoffice/platform/new']);
  }
}
