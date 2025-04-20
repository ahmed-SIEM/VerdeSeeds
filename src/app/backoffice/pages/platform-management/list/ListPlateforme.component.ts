import { Component, OnInit } from '@angular/core';
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
export class ListPlateformeComponent implements OnInit {

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
    // Clean up previous object URLs
    this.plateformes.forEach((platform: any) => {
      if (platform._blobUrl) {
        URL.revokeObjectURL(platform._blobUrl);
      }
    });
  
    this.ps.getPlateforms().subscribe({
      next: async (data) => {
        const platformsWithImages = await Promise.all(
          data.map(async (platform: any) => {
            let imageUrl: string | null = null;
  
            if (platform.imageId) {
              try {
                const blob = await this.firestore.getFile(platform.imageId).toPromise();
                if (blob) {
                  imageUrl = URL.createObjectURL(blob);
                  platform._blobUrl = imageUrl;
                }
              } catch (err) {
                console.error('Error getting image blob:', err);
              }
            }
  
            return {
              ...platform,
              imageUrl
            };
          })
        );
  
        this.plateformes = platformsWithImages;
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

  async getImageUrl(imageId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.firestore.getFile(imageId).subscribe({
        next: (blob) => {
          const url = URL.createObjectURL(blob);
          resolve(url);
          console.log('Image URL:', url);

        },
        error: (error) => {
          console.error('Error fetching image:', error);
          reject(error);
        }
      });
    });
  }
}
