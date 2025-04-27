import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/User/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
resetForm: FormGroup;
  token = '';
  message = '';
  errorMessage = '';
  isLoading = false;
  passwordStrength: 'weak' | 'medium' | 'strong' = 'weak';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: [this.matchingPasswords] });

    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });

    this.resetForm.get('newPassword')?.valueChanges.subscribe(value => {
      this.passwordStrength = this.evaluatePasswordStrength(value);
    });
  }

  onSubmit() {
    if (this.resetForm.invalid || !this.token) return;

    this.isLoading = true;
    const { newPassword } = this.resetForm.value;

    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: (res: any) => {
        this.message = res.message || '✅ Password reset successfully.';
        this.errorMessage = '';
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/authentication/login']), 2000);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message || '❌ Failed to reset password.';
        this.message = '';
        this.isLoading = false;
      }
    });
  }

  matchingPasswords(group: AbstractControl): ValidationErrors | null {
    const password = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  evaluatePasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
    const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    const medium = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (strong.test(password)) return 'strong';
    if (medium.test(password)) return 'medium';
    return 'weak';
  }

  get passwordMismatch() {
    return this.resetForm.errors?.['passwordsMismatch'] && this.resetForm.touched;
  }

  get passwordStrengthColor(): string {
    switch (this.passwordStrength) {
      case 'strong':
        return '#4caf50'; 
      case 'medium':
        return '#ff9800'; 
      default:
        return '#f44336'; 
    }
  }
  
  get passwordStrengthWidth(): string {
    switch (this.passwordStrength) {
      case 'strong':
        return '100%';
      case 'medium':
        return '66%';
      default:
        return '33%';
    }
  }
  }
