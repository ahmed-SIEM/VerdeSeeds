import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Image {
    id?: number;
    name?: string;
    imageUrl?: string;
    imageId?: string;
}



@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private url: string = 'http://localhost:8081/cloudinary'

  constructor(private myHttp: HttpClient) {}

  public list(): Observable<Image[]> {
    return this.myHttp.get<Image[]>(`${this.url}/list`);
  }

  public upload(image:File): Observable<any> {
    const formData = new FormData();
    formData.append('mfile', image);
    return this.myHttp.post(`${this.url}/upload`, formData);
  }

  public delete(id: any) : Observable<any> {
    return this.myHttp.delete(`${this.url}/delete/${id}`);
  }

    public getImage(id: any): Observable<any> {
        return this.myHttp.get(`${this.url}/get/${id}`);
    }

  public getImageUrl(imageId: string): string {
    return `${this.url}/get/${imageId}`;
  }
 
}
