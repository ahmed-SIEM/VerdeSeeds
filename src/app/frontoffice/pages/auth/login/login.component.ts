import { Component } from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/User/auth.service';
import { AuthRequest } from 'src/app/models/user/authRequest.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage= '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}
  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required, Validators.email],
      password: ['', Validators.required]
    });
  }
  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.isLoading = true;
    const loginData: AuthRequest = this.loginForm.value;
    this.authService.login(loginData).subscribe({
      next: () => {
        const role = this.authService.getUserRole();
        if (role === 'admin') {
          this.router.navigate(['/backoffice']);
        } else {
          this.router.navigate(['/frontoffice/home']);
        }
        },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Login failed';
        this.isLoading = false;
      }
    });
  }

}
