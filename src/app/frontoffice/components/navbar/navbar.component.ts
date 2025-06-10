import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/User/auth.service';
import { User } from 'src/app/models/user/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  signOut(): void {
    this.authService.signOut();
  }
}
