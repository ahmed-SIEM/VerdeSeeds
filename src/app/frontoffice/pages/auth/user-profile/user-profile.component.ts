import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/User/auth.service';
import { User } from 'src/app/models/user/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  user: User = {} as User;
  isLoading = true;
  errorMessage = '';
  selectedTabIndex = 0;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.authService.getUserProfile().subscribe({
      next: (user) => {
        this.user = { ...this.user, ...user };
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
      },
    });
  }

  saveChanges(): void {
    if (!this.user) return;

    this.authService.updateProfile(this.user).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.snackBar.open('Profile updated successfully!', 'Close', {
          duration: 3000,
        });
      },
      error: (error) => {
        this.snackBar.open('Failed to update profile.', 'Close', {
          duration: 3000,
        });
        console.error(error);
      },
    });
  }

  getUserInitials(): string {
    const first = this.user.nom?.charAt(0) || '';
    const last = this.user.prenom?.charAt(0) || '';
    return first + last;
  }
}
