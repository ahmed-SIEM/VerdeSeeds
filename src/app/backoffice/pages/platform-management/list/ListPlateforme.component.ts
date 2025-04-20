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
  typePackOptions = Object.values(this.TypePack);
  selectedPlateforme: any = null;
  test: Blob | null = null;

  image: File | null = null;
  imageMin: string | null = null;

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
      next: async (data) => {
        const platformsWithImages = await Promise.all(
          data.map(async platform => {
            if (platform.imageId) {
              try {
                const imageUrl = await firstValueFrom(this.firestore.getDirectImageUrl(platform.imageId));
                return { ...platform, imageUrl };
              } catch (err) {
                console.error('Error loading image:', err);
                return { ...platform, imageUrl: null };
              }
            }
            return { ...platform, imageUrl: null };
          })
        );
        this.plateformes = platformsWithImages;
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
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.image = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imageMin = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.image = null;
      this.imageMin = null;
      alert('Please select an image file');
    }
  }


  loadtestimage() {
    console.log('Loading image...');
    this.firestore.getFile('a09b23e3-2986-484f-9523-cb491f7eeb53_1715448051648.jpeg').subscribe({
      next: (url) => {
        this.test = url;
      },
      error: (error) => {
        console.error('Error loading image:', error);
      }
    });
  }
}
