import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from 'src/app/models/user/user.model';
import { AuthenticationResponse } from 'src/app/models/user/authentication-response.model';
import { AuthRequest } from 'src/app/models/user/authRequest.model';
import { RegisterRequest } from 'src/app/models/user/registerRequest.model';
import { environment } from 'src/environments/environment';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    const storedUser = localStorage.getItem('currentUser');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing user:', error);
        this.clearAuthData();
      }
    }
  }

  // Update OAuth2 endpoints
  initiateGoogleAuth(): string {
    return `${environment.apiUrl}/oauth2/authorization/google`;
  }

  handleOAuth2Callback(code: string): Observable<AuthenticationResponse> {
    return this.http.get<AuthenticationResponse>(
      `${environment.apiUrl}/login/oauth2/code/google`, 
      { 
        params: { code },
        withCredentials: true 
      }
    ).pipe(
      tap(response => {
        if (response.token) {
          this.storeAuthData(response);
        }
      })
    );
  }

  private decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (e) {
      console.error('Invalid token', e);
      return null;
    }
  }

  private storeUserData(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private redirectBasedOnRole(role: string): void {
    if (role === 'ROLE_ADMIN') {
      this.router.navigate(['/backoffice']);
    } else {
      this.router.navigate(['/frontoffice/home']);
    }
  }

  // Authentication Methods
  register(request: RegisterRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.apiUrl}/signup`, request).pipe(
      tap(response => {
        if (response.token) {
          this.storeAuthData(response);
        }
      })
    );
  }

  login(request: AuthRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.apiUrl}/generateToken`, request).pipe(
      tap(response => {
        if (response.token) {
          this.storeAuthData(response);
        }
      })
    );
  }

  private storeAuthData(response: AuthenticationResponse): void {
    localStorage.setItem('token', response.token);
    this.storeUserData(response.user);
  }

  // User Management Methods
  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/userProfile`);
  }

  updateProfile(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile`, user);
  }

  // Token Management
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Auth State Methods
  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Token Decoding Methods
  getDecodedToken(): any {
    const token = this.getToken();
    return token ? this.decodeToken(token) : null;
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

  // Password Recovery Methods
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password?email=${email}`, {});
  }

  resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/reset-password`,
      null,
      { params: { token, newPassword } }
    );
  }

  // Email Verification
  verifyEmail(token: string): Observable<boolean> {
    return this.http.get<boolean>(`${environment.apiUrl}/auth/verify?token=${token}`);
  }

  signOut(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/frontoffice/login']);
  }
}