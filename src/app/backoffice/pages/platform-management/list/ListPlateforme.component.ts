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

interface packstats {
  BASIC: number,  
  PREMIUM: number,
  ADVANCED: number
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
  report = [
    {
      label: 'Total Platforms',
      value: 0,
      icon: 'fas fa-globe',
      color: 'text-success',
      iconBg: 'bg-success bg-opacity-10'
    },
    {
      label: 'Active Platforms',
      value: 0,
      icon: 'fas fa-check-circle',
      color: 'text-info',
      iconBg: 'bg-info bg-opacity-10'
    },
    {
      label: 'Expired Platforms',
      value: 0,
      icon: 'fas fa-exclamation-circle',
      color: 'text-warning',
      iconBg: 'bg-warning bg-opacity-10'
    }
  ];

  packstats = [
    {
      label: 'Basic',
      value: 0,
      icon: 'fas fa-box',
      color: 'text-primary',
      iconBg: 'bg-primary'
    },
    {
      label: 'Premium',
      value: 0,
      icon: 'fas fa-box-open',
      color: 'text-warning',
      iconBg: 'bg-warning'
    },
    {
      label: 'Advanced',
      value: 0,
      icon: 'fas fa-boxes',
      color: 'text-success',
      iconBg: 'bg-success'
    }
  ];

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
      next: (data: report) => {
        this.report[0].value = data.TotalPlateformes;
        this.report[1].value = data.ActivePlateformes;
        this.report[2].value = data.ExpiredPlateformes;
      },
      error: (error) => {
        console.error('Error generating report:', error);
      }
    });

    this.ps.getMostlyBoughtPacks().subscribe({
      next: (data: any) => {
          const packData: packstats = {
            BASIC: data.BASIC || 0,
            PREMIUM: data.PREMIUM || 0,
            ADVANCED: data.ADVANCED || 0
          };
          this.packstats[0].value = packData.BASIC;
          this.packstats[1].value = packData.PREMIUM;
          this.packstats[2].value = packData.ADVANCED;
          
      },
      error: (error) => {
        console.error('Error fetching mostly bought packs:', error);
      }
    });
  }

  get sortedPacks() {
    return this.packstats.sort((a, b) => b.value - a.value).slice(0, 3);
  }

  getPackPercentage(count: number): number {
    const total = this.packstats.reduce((sum, pack) => sum + pack.value, 0);
    return total > 0 ? (count / total) * 100 : 0;
  }
  
}
