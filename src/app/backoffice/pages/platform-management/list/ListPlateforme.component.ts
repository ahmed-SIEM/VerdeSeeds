import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlateformeService } from 'src/app/services/plateforme/plateforme.service';
import { ImageService } from 'src/app/services/image.service';

interface Image {
  id?: number;
  name?: string;
  imageUrl?: string;
  imageId?: string;
}

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
  images: Image[] = [];

  constructor(
    private ps: PlateformeService,
    private router: Router,
    private imageService: ImageService
  ) { }

  ngOnInit() {
    this.loadPlateformes();
    this.loadUsers();
    this.generateReport();
    this.loadImages();
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
        this.plateformes = data 
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

  loadImages() {
    this.imageService.list().subscribe((data: Image[]) => {
      this.images = data;
      console.log('Images loaded:', this.images);
    }, (error) => {
      console.error('Error loading images:', error);
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

  onUpload(): void {
    if (this.image) {
      this.imageService.upload(this.image).subscribe({
        next: (data) => {
          console.log('Image uploaded:', data);
          this.loadImages();
          this.image = null;
          this.imageMin = null;
        }
      });
    }
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this image?')) {
      this.imageService.delete(id).subscribe({
        next: (data) => {
          console.log('Image deleted:', data);
          this.loadImages();
        }
      });
    }
  }

  getImageUrl(imageId: string): string {
    return this.imageService.getImageUrl(imageId);
  }
}
