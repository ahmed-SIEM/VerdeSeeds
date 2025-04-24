import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

export interface Auction {
  id?: number; // Rendons l'id optionnel pour la création
  startPrice: number;
  currentPrice?: number; // Optionnel car peut être initialisé côté serveur
  startTime: string; // Format ISO string
  endTime: string; // Format ISO string
  active?: boolean; // Optionnel avec valeur par défaut
  article?: {
    id: number;
  };
  articleId?: number;
  bids?: any[];
  payment?: any;
}

export interface AuctionUpdate {
  startPrice: number;
  currentPrice: number;  // Add this field
  startTime: string;
  endTime: string;
  active: boolean;
  article?: any;        // Add this field
}

@Injectable({
  providedIn: 'root'
})
export class AuctionService {
  private apiUrl = 'http://localhost:8081/api/auctions'; // adapte si besoin

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.status === 400) {
      errorMessage = 'Invalid auction data. Please check your input.';
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server error: ${error.status}\nMessage: ${error.message}`;
    }
    console.error('Full error:', error);
    return throwError(() => new Error(errorMessage));
  }

  getAllAuctions(): Observable<Auction[]> {
    return this.http.get<Auction[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getAuctionById(id: number): Observable<Auction> {
    return this.http.get<Auction>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        if (!response || typeof response !== 'object') {
          throw new Error('Invalid auction data received');
        }
        return response as Auction;
      }),
      catchError(this.handleError)
    );
  }

  getAuctionsByArticle(articleId: number): Observable<Auction[]> {
    return this.http.get<Auction[]>(`${this.apiUrl}/by-article/${articleId}`).pipe(
      catchError(this.handleError)
    );
  }

  createAuction(auctionData: Omit<Auction, 'id'> , id : number): Observable<Auction> {
    return this.http.post<Auction>(`${this.apiUrl}/${id}`, auctionData).pipe(
      catchError(this.handleError)
    );
  }

  updateAuction(auctionId: number, auctionData: Partial<Auction>): Observable<Auction> {
    if (!auctionData.startPrice || !auctionData.startTime || !auctionData.endTime || auctionData.active === undefined) {
      return throwError(() => new Error('Missing required auction data'));
    }

    const updateData: AuctionUpdate = {
      startPrice: auctionData.startPrice,
      currentPrice: auctionData.startPrice, // Initialize with startPrice
      startTime: auctionData.startTime,
      endTime: auctionData.endTime,
      active: auctionData.active
    };
    
    const url = auctionData.articleId 
      ? `${this.apiUrl}/article/${auctionData.articleId}/edit/${auctionId}`
      : `${this.apiUrl}/${auctionId}`;

    console.log('Sending update request:', { url, updateData });
    
    return this.http.put<Auction>(url, updateData).pipe(
      catchError(error => {
        console.error('Update error:', error);
        if (error.status === 400) {
          return throwError(() => new Error('Données de mise à jour invalides. Veuillez vérifier les valeurs saisies.'));
        }
        return this.handleError(error);
      })
    );
  }

  deleteAuction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
}