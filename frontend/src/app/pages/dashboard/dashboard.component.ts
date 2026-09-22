import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, Stats } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="header">
        <div>
          <h1>Welcome, {{ auth.currentUser()?.name }} 👋</h1>
          <p class="subtitle">Track your interview preparation progress</p>
        </div>
        <a routerLink="/practice" class="btn btn-primary">Start Practice</a>
      </div>

      <div *ngIf="loading" class="loading">Loading stats...</div>

      <div *ngIf="!loading && stats" class="stats-grid">
        <div class="stat-card card">
          <div class="stat-value">{{ stats.totalAttempts }}</div>
          <div class="stat-label">Total Attempts</div>
        </div>
        <div class="stat-card card">
          <div class="stat-value">{{ stats.averageScore }}/10</div>
          <div class="stat-label">Average Score</div>
        </div>
        <div class="stat-card card">
          <div class="stat-value">{{ stats.roleStats.length }}</div>
          <div class="stat-label">Roles Practiced</div>
        </div>
      </div>

      <div *ngIf="!loading && stats && stats.roleStats.length > 0" class="card roles-section">
        <h2>Performance by Role</h2>
        <div class="role-list">
          <div *ngFor="let r of stats.roleStats" class="role-item">
            <div class="role-name">{{ r.role }}</div>
            <div class="role-meta">
              <span>{{ r.attempts }} attempts</span>
              <span class="score" [class]="getScoreClass(r.averageScore)">
                {{ r.averageScore }}/10
              </span>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && stats && stats.totalAttempts === 0" class="empty-state card">
        <h3>No attempts yet</h3>
        <p>Start practicing to see your progress here.</p>
        <a routerLink="/practice" class="btn btn-primary">Go to Practice</a>
      </div>
    </div>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    h1 { font-size: 1.75rem; }
    .subtitle { color: #94a3b8; margin-top: 0.25rem; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      text-align: center;
      padding: 1.75rem 1rem;
    }
    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #38bdf8;
    }
    .stat-label {
      color: #94a3b8;
      margin-top: 0.35rem;
      font-size: 0.9rem;
    }
    .roles-section h2 {
      font-size: 1.2rem;
      margin-bottom: 1.25rem;
    }
    .role-item {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .role-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.875rem 1rem;
      background: #0f172a;
      border-radius: 8px;
    }
    .role-name { font-weight: 500; }
    .role-meta {
      display: flex;
      gap: 1.25rem;
      color: #94a3b8;
      font-size: 0.9rem;
    }
    .score { font-weight: 600; }
    .score-high { color: #4ade80; }
    .score-mid  { color: #facc15; }
    .score-low  { color: #f87171; }
    .empty-state {
      text-align: center;
      padding: 3rem 1.5rem;
    }
    .empty-state h3 { margin-bottom: 0.5rem; }
    .empty-state p { color: #94a3b8; margin-bottom: 1.5rem; }
    .loading { text-align: center; color: #94a3b8; padding: 3rem; }
  `]
})
export class DashboardComponent implements OnInit {
  stats: Stats | null = null;
  loading = true;

  constructor(public auth: AuthService, private api: ApiService) {}

  ngOnInit() {
    this.api.getStats().subscribe({
      next: (res) => {
        this.stats = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getScoreClass(score: number): string {
    if (score >= 7) return 'score-high';
    if (score >= 4) return 'score-mid';
    return 'score-low';
  }
}