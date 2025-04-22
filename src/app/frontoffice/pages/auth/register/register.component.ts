import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/User/auth.service';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { RegisterRequest } from 'src/app/models/user/registerRequest.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate(
          '0.3s ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  flashMessage = '';
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      adresse: ['', Validators.required],
    });
  }

  get passwordStrength(): string {
    const value = this.registerForm.get('password')?.value || '';
    if (value.length < 6) return 'Weak';
    if (/[A-Z]/.test(value) && /[0-9]/.test(value) && /[!@#$%^&*]/.test(value))
      return 'Strong';
    if (/[A-Z]/.test(value) || /[0-9]/.test(value)) return 'Medium';
    return 'Weak';
  }

  get passwordStrengthColor(): string {
    switch (this.passwordStrength) {
      case 'Strong':
        return '#4caf50';
      case 'Medium':
        return '#ff9800';
      default:
        return '#f44336';
    }
  }

  get passwordStrengthWidth(): string {
    switch (this.passwordStrength) {
      case 'Strong':
        return '100%';
      case 'Medium':
        return '66%';
      default:
        return '33%';
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    const request: RegisterRequest = this.registerForm.value;
    request.roles = 'AGRICULTEUR'

    this.authService.register(request).subscribe({
      next: () => {
        this.flashMessage = 'Un email a été envoyé pour vérifier votre compte.';
        this.errorMessage = '';
        this.isLoading = false;
        this.registerForm.reset();
        setTimeout(() => (this.flashMessage = ''), 60000);
      },
      error: (err) => {
        this.errorMessage =
          err.error?.message || 'Erreur lors de l’inscription.';
        this.flashMessage = '';
        this.isLoading = false;
      },
    });
  }
}