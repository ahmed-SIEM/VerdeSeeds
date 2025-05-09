import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/User/auth.service';
import { AuthRequest } from 'src/app/models/user/authRequest.model';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  rememberDevice = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      recaptcha: [null, Validators.required]
    });

    // Handle OAuth2 callback
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
        this.handleOAuthCallback(code);
      }
    });
  }

  async signInWithGoogle() {
    try {
      this.isLoading = true;
      window.location.href = this.authService.initiateGoogleAuth();
    } catch (error) {
      this.errorMessage = 'Google sign-in failed. Please try again.';
      this.isLoading = false;
    }
  }

  private handleOAuthCallback(code: string) {
    this.isLoading = true;
    this.authService.handleOAuth2Callback(code).subscribe({
      next: () => {
        const role = this.authService.getUserRole();
        if (role === 'ROLE_ADMIN') {
          this.router.navigate(['/backoffice']);
        } else {
          this.router.navigate(['/frontoffice/home']);
        }
      },
      error: (err) => {
        this.errorMessage = 'Authentication failed. Please try again.';
        this.isLoading = false;
      }
    });
  }

  async signInWithFacebook() {
    try {
      this.isLoading = true;
      // Implement your Facebook sign-in logic here
    } catch (error) {
      this.errorMessage = 'Facebook sign-in failed. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.isLoading = true;
  
    const loginFormValue = this.loginForm.value;
  
    const loginData: AuthRequest = {
      username: loginFormValue.username,
      password: loginFormValue.password,
      recaptchaToken: loginFormValue.recaptcha  // 💥 important ici
    };
  
    this.authService.login(loginData).subscribe({
      next: () => {
        const role = this.authService.getUserRole();
        this.router.navigate(role === 'admin' ? ['/backoffice'] : ['/frontoffice/home']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Login failed';
        this.isLoading = false;
      }
    });
  }
  

}