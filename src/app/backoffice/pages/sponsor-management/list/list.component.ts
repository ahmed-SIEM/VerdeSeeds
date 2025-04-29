import { Component, OnInit } from '@angular/core';
import { SponsorServcie } from 'src/app/services/plateforme/sponsor.service';
import { Router } from '@angular/router';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';




@Component({
  selector: 'app-componentlist',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListSponsor implements OnInit {

  Sponsors: any[] = [];
  searchTerm: string = '';
  selectedPreviewImage: string = '';
  itemsPerPage: number = 1;
  currentPage: number = 1;
  
  constructor(
    private sponsorService: SponsorServcie, 
    private firestore : FirebaseStorageService,
    private router: Router) {}
  
    ngOnInit(): void {
      this.loadSponsors();
    }
  
    get filteredSponsorstsList() {
      const filtered = this.Sponsors.filter(sponsor => {
        const matchesSearch = !this.searchTerm || 
        sponsor.type.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        sponsor.name.toLowerCase().includes(this.searchTerm.toLowerCase()); 
        return matchesSearch;
      });

      // Apply pagination
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      return filtered.slice(startIndex, startIndex + this.itemsPerPage);
    }

    get totalPages(): number {
      const filtered = this.Sponsors.filter(sponsor => {
        return !this.searchTerm || 
          sponsor.type.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          sponsor.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      });
      return Math.ceil(filtered.length / this.itemsPerPage);
    }

    changePage(page: number): void {
      this.currentPage = page;
    }
  
    loadSponsors(): void {
      this.sponsorService.getSponsors().subscribe(data => {
        this.Sponsors = data;
      });
    }

    private deleteFromDatabase(id: number) {
      this.sponsorService.deleteSponsor(id).subscribe({
        next: () => {
          this.loadSponsors();
        },
        error: (error) => {
          console.error('Error deleting platform:', error);
        }
      });
    }
  
    deleteSponsor(sponsor : any): void {
      if (confirm('Are you sure you want to delete this sponsor?')) {
        if (sponsor.logo) {
          this.firestore.deleteFile(sponsor.logo).subscribe({
            next: () => {
              this.deleteFromDatabase(sponsor.idSponsor);
            },
            error: (error) => {
              console.error('Error deleting platform image:', error);
              this.deleteFromDatabase(sponsor.idSponsor);
            }
          });
        } else {
          this.deleteFromDatabase(sponsor.idSponsor);
        }
      }
    }
  
    editSponsor(sponsor: any): void {
      this.router.navigate(['/backoffice/sponsor', sponsor.id, 'edit']);
    }
  
    addSponsor(): void {
      this.router.navigate(['/backoffice/sponsor', 'add']);
    }
 
}