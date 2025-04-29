import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/User/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  isLoading = false;
  message='';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
  onSubmit():void {
    if (this.forgotForm.invalid) return;
    this.isLoading = true;
    this.errorMessage = '';
    this.message = '';
    const email = this.forgotForm.value.email;
    this.authService.forgotPassword(email).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.message = res.message || '✅ Reset link sent successfully!';
        this.errorMessage = '';
      },
      error: (err:HttpErrorResponse) => {
        this.isLoading = false;
        this.message = '';
        if(err.status === 404) {
          this.errorMessage = '❌ No account found with this email address';
        } else if (err.status === 429) {
          this.errorMessage = '❌ Too many requests. Please try again later';
        } else {
        this.errorMessage = err.error?.message || '❌ Failed to send reset link. Please try again';
        }
    }
    });
 }
}
