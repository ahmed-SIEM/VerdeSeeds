import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Auction {
  id?: number; // Rendons l'id optionnel pour la création
  startPrice: number;
  currentPrice?: number; // Optionnel car peut être initialisé côté serveur
  startTime: string; // Format ISO string
  endTime: string; // Format ISO string
  active?: boolean; // Optionnel avec valeur par défaut
  articleId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuctionService {
  private apiUrl = 'http://localhost:8081/api/auctions'; // adapte si besoin

  constructor(private http: HttpClient) {}

  getAllAuctions(): Observable<Auction[]> {
    return this.http.get<Auction[]>(this.apiUrl);
  }

  getAuctionById(id: number): Observable<Auction> {
    return this.http.get<Auction>(`${this.apiUrl}/${id}`);
  }

  getAuctionsByArticle(articleId: number): Observable<Auction[]> {
    return this.http.get<Auction[]>(`${this.apiUrl}/by-article/${articleId}`);
  }

  createAuction(auctionData: Omit<Auction, 'id'> , id : number): Observable<Auction> {
    return this.http.post<Auction>(`${this.apiUrl}/${id}`, auctionData);
  }

  updateAuction(auctionId: number, auctionData: Partial<Auction>): Observable<Auction> {
    return this.http.put<Auction>(`${this.apiUrl}/${auctionId}`, auctionData);
  }

  deleteAuction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


}