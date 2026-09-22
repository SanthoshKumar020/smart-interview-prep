import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card card">
        <h1>Create Account</h1>
        <p class="subtitle">Start preparing for your dream job</p>

        <div *ngIf="error" class="alert alert-error">{{ error }}</div>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Name</label>
            <input type="text" class="form-control" [(ngModel)]="name" name="name" required placeholder="John Doe">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" class="form-control" [(ngModel)]="email" name="email" required placeholder="you@example.com">
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" class="form-control" [(ngModel)]="password" name="password" required minlength="6" placeholder="Min 6 characters">
          </div>
          <button type="submit" class="btn btn-primary full-width" [disabled]="loading">
            {{ loading ? 'Creating account...' : 'Register' }}
          </button>
        </form>

        <p class="footer-text">
          Already have an account? <a routerLink="/login">Login</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 120px);
      padding: 1rem;
    }
    .auth-card {
      width: 100%;
      max-width: 420px;
    }
    h1 {
      font-size: 1.75rem;
      margin-bottom: 0.25rem;
    }
    .subtitle {
      color: #94a3b8;
      margin-bottom: 1.75rem;
    }
    .full-width {
      width: 100%;
      margin-top: 0.5rem;
    }
    .footer-text {
      text-align: center;
      margin-top: 1.5rem;
      color: #94a3b8;
      font-size: 0.9rem;
    }
  `]
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.error = '';

    this.auth.register(this.name, this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}