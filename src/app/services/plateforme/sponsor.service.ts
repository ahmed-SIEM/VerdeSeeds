import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Sponsor } from '../../models/sponsor.interface';

@Injectable({
  providedIn: 'root'
})
export class SponsorServcie {
  private apiUrl = `${environment.apiUrl}/sponsor`;

  constructor(private http: HttpClient) {}

  getSponsors(): Observable<Sponsor[]> {
    return this.http.get<Sponsor[]>(`${this.apiUrl}`);
  }

  getSponsor(id: number): Observable<Sponsor> {
    return this.http.get<Sponsor>(`${this.apiUrl}/${id}`);
  }

  createSponsor(sponsor: Sponsor): Observable<Sponsor> {
    return this.http.post<Sponsor>(`${this.apiUrl}`, sponsor);
  }

  updateSponsor(sponsor: Sponsor): Observable<Sponsor> {
    return this.http.put<Sponsor>(`${this.apiUrl}`, sponsor);
  }

  deleteSponsor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAllsponsorsbyplatformid(Id: number): Observable<Sponsor[]> {
    return this.http.get<Sponsor[]>(`${this.apiUrl}/platform/${Id}`);
  }

}
