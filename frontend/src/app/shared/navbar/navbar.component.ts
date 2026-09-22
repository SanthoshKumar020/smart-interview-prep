import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="container nav-content">
        <a routerLink="/dashboard" class="logo">
          <span class="logo-icon">🚀</span>
          <span>Smart Interview Prep</span>
        </a>

        <div class="nav-links" *ngIf="auth.currentUser() as user">
          <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
          <a routerLink="/practice" routerLinkActive="active">Practice</a>
          <a routerLink="/history" routerLinkActive="active">History</a>
          <div class="user-menu">
            <span class="user-name">{{ user.name }}</span>
            <button class="btn btn-secondary btn-sm" (click)="auth.logout()">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: #1e293b;
      border-bottom: 1px solid #334155;
      height: 64px;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .nav-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 700;
      font-size: 1.15rem;
      color: #f1f5f9;
    }
    .logo-icon { font-size: 1.4rem; }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .nav-links a {
      color: #94a3b8;
      font-weight: 500;
      transition: color 0.2s;
    }
    .nav-links a:hover, .nav-links a.active {
      color: #38bdf8;
    }
    .user-menu {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-left: 1rem;
      padding-left: 1rem;
      border-left: 1px solid #334155;
    }
    .user-name {
      color: #cbd5e1;
      font-size: 0.9rem;
    }
    .btn-sm {
      padding: 0.4rem 0.9rem;
      font-size: 0.85rem;
    }
  `]
})
export class NavbarComponent {
  constructor(public auth: AuthService) {}
}