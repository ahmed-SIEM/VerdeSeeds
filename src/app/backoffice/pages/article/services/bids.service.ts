import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Bid {
  id?: number;
  bidAmount: number;
  bidTime: Date;
  auction: {
    id: number;
  };
  user?: {
    idUser: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class BidsService {
  private apiUrl = 'http://localhost:8081/api/bids';

  constructor(private http: HttpClient) {}

    private async generateHeaders(): Promise<HttpHeaders> {
      const token =  localStorage.getItem('token');
      if (!token) {
        throw new Error('No token available. User is not logged in.');
      }
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
    }
    
  getAllBids(): Observable<Bid[]> {
    return new Observable(observer => {
      this.generateHeaders().then(headers => {
        this.http.get<Bid[]>(this.apiUrl, { headers }).subscribe(
          data => observer.next(data),
          error => observer.error(error),
          () => observer.complete()
        );
      }).catch(error => observer.error(error));
    });
  }

  getBidById(id: number): Observable<Bid> {
    return new Observable(observer => {
      this.generateHeaders().then(headers => {
        this.http.get<Bid>(`${this.apiUrl}/${id}`, { headers }).subscribe(
          data => observer.next(data),
          error => observer.error(error),
          () => observer.complete()
        );
      }).catch(error => observer.error(error));
    });
  }

  createBid(auctionId: number, bidData: Partial<Bid>): Observable<Bid> {
    return new Observable(observer => {
      this.generateHeaders().then(headers => {
        const userId = this.getCurrentUserId();
        const payload = {
          bidAmount: bidData.bidAmount,
          bidTime: new Date(),
          auction: {
            id: auctionId
          },
          user: {
            idUser: userId
          }
        };
        
        // Use the main endpoint as defined in the controller
        this.http.post<Bid>(`${this.apiUrl}`, payload, { headers }).subscribe(
          data => observer.next(data),
          error => observer.error(error),
          () => observer.complete()
        );
      }).catch(error => observer.error(error));
    });
  }

  private getCurrentUserId(): number {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      throw new Error('No authenticated user found');
    }
    const user = JSON.parse(userStr);
    return user.idUser;
  }

  updateBid(id: number, auctionId: number, bidData: Partial<Bid>): Observable<Bid> {
    return new Observable(observer => {
      this.generateHeaders().then(headers => {
        const url = `${this.apiUrl}/${id}`;
        const payload = {
          ...bidData,
          auctionId: auctionId
        };
        this.http.put<Bid>(url, payload, { headers }).subscribe(
          data => observer.next(data),
          error => observer.error(error),
          () => observer.complete()
        );
      }).catch(error => observer.error(error));
    });
  }

  deleteBid(id: number): Observable<void> {
    return new Observable(observer => {
      this.generateHeaders().then(headers => {
        this.http.delete<void>(`${this.apiUrl}/${id}`, { headers }).subscribe(
          () => observer.next(),
          error => observer.error(error),
          () => observer.complete()
        );
      }).catch(error => observer.error(error));
    });
  }

  getBidsByAuction(auctionId: number): Observable<Bid[]> {
    return new Observable(observer => {
      this.generateHeaders().then(headers => {
        this.http.get<Bid[]>(`${this.apiUrl}/auction/${auctionId}`, { headers }).subscribe(
          data => observer.next(data),
          error => observer.error(error),
          () => observer.complete()
        );
      }).catch(error => observer.error(error));
    });
  }

  getWonArticlesByUser(userId: number): Observable<any[]> {
    return new Observable(observer => {
      this.generateHeaders().then(headers => {
        this.http.get<any[]>(`${this.apiUrl}/user/${userId}/won-articles`, { headers }).subscribe(
          data => observer.next(data),
          error => observer.error(error),
          () => observer.complete()
        );
      }).catch(error => observer.error(error));
    });
  }
}
