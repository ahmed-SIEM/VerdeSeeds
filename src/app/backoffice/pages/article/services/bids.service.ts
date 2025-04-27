import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Bid {
  id?: number;
  bidAmount: number;
  bidTime: Date;
  auction: {
    id: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class BidsService {
  private apiUrl = 'http://localhost:8081/api/bids';

  constructor(private http: HttpClient) {}

  getAllBids(): Observable<Bid[]> {
    return this.http.get<Bid[]>(this.apiUrl);
  }

  getBidById(id: number): Observable<Bid> {
    return this.http.get<Bid>(`${this.apiUrl}/${id}`);
  }

  createBid(auctionId: number, bidData: Partial<Bid>): Observable<Bid> {
    const payload = {
      bidAmount: bidData.bidAmount,
      bidTime: bidData.bidTime,
      auction: {
        id: auctionId
      }
    };
    return this.http.post<Bid>(`${this.apiUrl}`, payload);
  }

  updateBid(id: number, auctionId: number, bidData: Partial<Bid>): Observable<Bid> {
    const url = `${this.apiUrl}/${id}`;
    const payload = {
      ...bidData,
      auctionId: auctionId
    };
    return this.http.put<Bid>(url, payload);
  }

  deleteBid(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getBidsByAuction(auctionId: number): Observable<Bid[]> {
    return this.http.get<Bid[]>(`${this.apiUrl}/auction/${auctionId}`);
  }
}
