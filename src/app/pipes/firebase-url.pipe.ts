import { Pipe, PipeTransform } from '@angular/core';
import { FirebaseStorageService } from '../services/firebase-storage.service';
import { Observable, of } from 'rxjs';

@Pipe({
  name: 'firebaseUrl',
})
export class FirebaseUrlPipe implements PipeTransform {
  constructor(private firebaseStorage: FirebaseStorageService) {}

  transform(fileName: string | null): Observable<string> {
    if (!fileName) {
      return of('');
    }
    return this.firebaseStorage.getFileUrl(fileName);
  }
}