import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, throwError, BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/user/user.model';
import { AuthenticationResponse } from 'src/app/models/user/authentication-response.model';
import { AuthRequest } from 'src/app/models/user/authRequest.model';
import { RegisterRequest } from 'src/app/models/user/registerRequest.model';
import { environment } from 'src/environments/environment';
import {jwtDecode} from 'jwt-decode';
import { RouterModule, Routes, Router } from '@angular/router';

import { response } from 'express';
import { U } from '@fullcalendar/core/internal-common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  private currentUserSubject = new BehaviorSubject<User | null>(null); //feha l current user connecté wala pas connecté w permet aux autre components de s'abonner aux changements
  public currentUser$ = this.currentUserSubject.asObservable();
  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('currentUser');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing user:', error);
        this.logout();
      }
    }
  }

  register(request: RegisterRequest): Observable<AuthenticationResponse> {
    return this.http
      .post<AuthenticationResponse>(`${this.apiUrl}/signup`, request)
      .pipe(
        tap((response) => {
          if (response.token) {
            this.storeAuthData(response);
          }
        })
      );
  }

  login(request: AuthRequest): Observable<AuthenticationResponse> {
    return this.http
      .post<AuthenticationResponse>(`${this.apiUrl}/generateToken`, request)
      .pipe(
        tap((response) => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
          }
        })
        //responseType: 'text' //khater token fel backend yji sous format de text
      );
  }

  handleOAuthSuccess(token: string): void {
    this.saveToken(token);

    const decoded = this.getDecodedToken();

    if (decoded) {
      const user: User = {
        idUser: decoded.id,
        email: decoded.sub,
        nom: decoded.nom,
        prenom: decoded.prenom,
        telephone: decoded.telephone || '',
        adresse: decoded.adresse || '',
        role: decoded.role,
      };
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      if(user.role === 'ROLE_ADMIN') {
        this.router.navigate(['/backoffice']);
      } else {
        this.router.navigate(['/frontoffice/home']);
      }
    } else {
      console.error("Failed to decode OAuth token.");
    }
  }
  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/userProfile`)
  }

  updateProfile(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile`, user);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getDecodedToken(): any {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode(token);
      } catch (e) {
        console.error('Invalid token', e);
        return null;
      }
    }
    return null;
  }

  verifyEmail(token: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${environment.apiUrl}/auth/verify?token=${token}`
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password?email=${email}`, {});
  }

  resetPassword(token: string, newPassword: string) {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/reset-password`,
      null,
      {
        params: { token, newPassword },
      }
    );
  }

  getUserEmail(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.sub || null;
  }

  getUserRole(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.role || null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private storeAuthData(response: AuthenticationResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('currentUser', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

}
