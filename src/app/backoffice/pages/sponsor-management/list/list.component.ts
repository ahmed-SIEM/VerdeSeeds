import { Component, OnInit } from '@angular/core';
import { SponsorServcie } from 'src/app/services/plateforme/sponsor.service';
import { Router } from '@angular/router';




@Component({
  selector: 'app-componentlist',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListSponsor implements OnInit {

  Sponsors: any[] = [];
    searchTerm: string = '';
    selectedPreviewImage: string = '';
  
    constructor(private sponsorService: SponsorServcie, private router: Router) {}
  
   
  
  
    ngOnInit(): void {
      this.loadSponsors();
    }
  
    get filteredSponsorstsList() {
      return this.Sponsors.filter(sponsor => {
        const matchesSearch = !this.searchTerm || 
        sponsor.type.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        sponsor.name.toLowerCase().includes(this.searchTerm.toLowerCase()); 
        return matchesSearch;
      });
    }
  
    loadSponsors(): void {
      this.sponsorService.getSponsors().subscribe(data => {
        this.Sponsors = data;
      });
    }
  
    deleteSponsor(id: number): void {
      if (confirm('Are you sure you want to delete this sponsor?')) {
        this.sponsorService.deleteSponsor(id).subscribe(() => {
          this.loadSponsors();
        });
      }
    }
  
    editSponsor(sponsor: any): void {
      this.router.navigate(['/backoffice/sponsor', sponsor.id, 'edit']);
    }
  
  
   
  
    addSponsor(): void {
      this.router.navigate(['/backoffice/sponsor', 'add']);
    }
 
}
