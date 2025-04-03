import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonService } from '../common.service';
@Injectable({
  providedIn: 'root'
})
export class PlateformeService {
  private url: string = 'http://localhost:8081/plateforme';



  constructor(private http: HttpClient , private commonService: CommonService) { }

  getPlateforms(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/retrieve-all-Plateformes`);
  }

  getPlateformeById(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  createPlateforme(plateforme: any): Observable<any> {
    return this.http.post<any>(`${this.url}`, plateforme);
  }

  updatePlateforme(id: number, plateforme: any): Observable<any> {
    return this.http.put<any>(`${this.url}/${id}`, plateforme);
  }

  deletePlateforme(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }

  getUsers(): Observable<any[]> {
    return this.commonService.getUsers();
  }
}
