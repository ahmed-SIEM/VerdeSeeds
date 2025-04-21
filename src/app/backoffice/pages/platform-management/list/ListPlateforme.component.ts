import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PlateformeService } from 'src/app/services/plateforme/plateforme.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { firstValueFrom } from 'rxjs';

interface report {
  TotalPlateformes: number,
  ExpiredPlateformes: number,
  ActivePlateformes: number
}

@Component({
  selector: 'app-Plateformelist',
  templateUrl: './Platformelist.component.html',
  styleUrls: ['./Platformelist.component.css']
})
export class ListPlateformeComponent implements OnInit, OnDestroy {

  TypePack = {
    GUEST: 'GUEST',
    BASIC: 'BASIC',
    PREMIUM: 'PREMIUM',
    ADVANCED: 'ADVANCED'
  }
  plateformes: any[] = [];
  report: report = {
    TotalPlateformes: 0,
    ExpiredPlateformes: 0,
    ActivePlateformes: 0
  };
  users: any[] = [];
  searchTerm: string = '';
  filterType: string = '';
  mostlyboughtpack: any[] = [];
  typePackOptions = Object.values(this.TypePack);
  selectedPlateforme: any = null;

  image: File | null = null;
  imageMin: string | null = null;

  itemsPerPage: number = 6;
  currentPage: number = 1;

  constructor(
    private ps: PlateformeService,
    private router: Router,
    private firestore : FirebaseStorageService
  ) { }

  ngOnInit() {
    this.loadPlateformes();
    this.loadUsers();
    this.generateReport();
  }

  ngOnDestroy() {
    this.plateformes.forEach(platform => {
      if (platform.imageUrl) {
        URL.revokeObjectURL(platform.imageUrl);
      }
    });
    this.firestore.clearCache();
  }

  get filteredPlatforms() {
    const filtered = this.plateformes.filter(platform => {
      const matchesSearch = !this.searchTerm || 
        platform.nomPlateforme.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        platform.description?.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesType = !this.filterType || platform.typePack === this.filterType;
      return matchesSearch && matchesType;
    });

    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    const filtered = this.plateformes.filter(platform => {
      const matchesSearch = !this.searchTerm || 
        platform.nomPlateforme.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        platform.description?.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesType = !this.filterType || platform.typePack === this.filterType;
      return matchesSearch && matchesType;
    });
    return Math.ceil(filtered.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  loadPlateformes() {
    this.ps.getPlateforms().subscribe({
      next: async (data) => {
        
        this.plateformes = data;
        this.generateReport();
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

  addplateforme() {
    this.router.navigate(['/backoffice/platform', 'new']);
  }

  editPlateforme(platform: any) {
    this.router.navigate(['/backoffice/platform', platform.idPlateforme, 'edit']);
  }

  viewPlateforme(platform: any) {
    this.router.navigate(['/backoffice/platform', platform.idPlateforme]);
  }

  previewPlateforme(platform: any) {
    this.router.navigate(['/backoffice/platform', 'preview', platform.idPlateforme]);
  }

  deletePlateforme(id: number) {
    const platform = this.plateformes.find(p => p.idPlateforme === id);
    if (!platform) return;

    if (confirm('Are you sure you want to delete this platform?')) {
      if (platform.logo) {
        this.firestore.deleteFile(platform.logo).subscribe({
          next: () => {
            this.deleteFromDatabase(id);
          },
          error: (error) => {
            console.error('Error deleting platform image:', error);
            this.deleteFromDatabase(id);
          }
        });
      } else {
        // If no image, just delete the platform
        this.deleteFromDatabase(id);
      }
    }
  }

  private deleteFromDatabase(id: number) {
    this.ps.deletePlateforme(id).subscribe({
      next: () => {
        this.loadPlateformes();
      },
      error: (error) => {
        console.error('Error deleting platform:', error);
      }
    });
  }

  isExpired(date: string): boolean {
    const currentDate = new Date();
    const expirationDate = new Date(date);
    return expirationDate < currentDate;
  }

  generateReport() {
    this.ps.getReport().subscribe({
      next: (data) => {
        this.report = data;
        console.log('Report generated:', this.report);
      },
      error: (error) => {
        console.error('Error generating report:', error);
      }
    });

    this.ps.getMostlyBoughtPacks().subscribe({
      next: (data) => {
        this.mostlyboughtpack = data;
        console.log('Mostly bought packs:', this.mostlyboughtpack);
      },
      error: (error) => {
        console.error('Error fetching mostly bought packs:', error);
      }
    });

  }

  get sortedPacks() {
    return Object.entries(this.mostlyboughtpack)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  getPackPercentage(count: number): number {
    const maxCount = Math.max(...Object.values(this.mostlyboughtpack));
    return maxCount === 0 ? 0 : (count / maxCount) * 100;
  }
  
}
