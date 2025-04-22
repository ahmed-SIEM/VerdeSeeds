import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuctionService, Auction } from '../../article/services/auction.service';

@Component({
  selector: 'app-auction-list',
  templateUrl: './auction-list.component.html',
})
export class AuctionListComponent implements OnInit {
  articleId!: number;
  auctions: Auction[] = [];
  isFromArticle: boolean = false; // Indicateur pour savoir si on vient de la page article

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auctionService: AuctionService
  ) {}

  ngOnInit(): void {
    this.articleId = Number(this.route.snapshot.paramMap.get('articleId'));
    if( this.articleId){
      this.isFromArticle = true; 
      this.fetchArtictionAuctions()
 
    }else{
      this.fetchAuctions();
    }
  
  }

  fetchAuctions(): void {
    this.auctionService.getAllAuctions().subscribe({
      next: (data) => {
        this.auctions = data;
     
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des enchères', error);
      },
    });
  }

  fetchArtictionAuctions(): void {
    this.auctionService.getAuctionsByArticle(this.articleId).subscribe({
      next: (data) => {
        this.auctions = data;
        console.log(data)
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des enchères', error);
      },
    });
  }

  deleteAuction(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette enchère ?')) {
      this.auctionService.deleteAuction(id).subscribe({
        next: () => this.fetchAuctions(),
        error: (error) => {
          console.error('Erreur lors de la suppression de l\'enchère', error);
        },
      });
    }
  }

  goToAddAuction(): void {
    this.router.navigate([`/backoffice/auctions/create`]);  // Met à jour le chemin pour la création
  }

  goToEditAuction(auctionId: number): void {
    this.router.navigate([`/backoffice/articles/${this.articleId}/auction/edit`]);  // Met à jour le chemin pour l'édition
  }
}
