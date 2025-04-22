import { Injectable } from '@angular/core';
import { FirebaseStorageService } from './firebase-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private firebaseStorage: FirebaseStorageService
  ) {}

  logout() {
    this.firebaseStorage.clearCache();
  }
}