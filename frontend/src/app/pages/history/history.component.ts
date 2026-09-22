import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Attempt } from '../../core/services/api.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Attempt History</h1>
      <p class="subtitle">Review your past answers and feedback</p>

      <div *ngIf="loading" class="loading">Loading history...</div>

      <div *ngIf="!loading && attempts.length === 0" class="empty card">
        <p>No attempts yet. Go practice!</p>
      </div>

      <div *ngFor="let a of attempts" class="card attempt-card">
        <div class="attempt-header">
          <div>
            <span class="role">{{ a.role }}</span>
            <span class="date">{{ a.createdAt | date:'medium' }}</span>
          </div>
          <div class="score-badge" [class]="getScoreClass(a.score)">
            {{ a.score }}/10
          </div>
        </div>

        <p class="question">{{ a.question }}</p>

        <details>
          <summary>View Answer & Feedback</summary>
          <div class="details-content">
            <div class="section">
              <h4>Your Answer</h4>
              <p>{{ a.userAnswer }}</p>
            </div>
            <div class="section">
              <h4>Strengths</h4>
              <ul>
                <li *ngFor="let s of a.feedback.strengths">{{ s }}</li>
              </ul>
            </div>
            <div class="section">
              <h4>Improvements</h4>
              <ul>
                <li *ngFor="let i of a.feedback.improvements">{{ i }}</li>
              </ul>
            </div>
            <div class="section">
              <h4>Improved Answer</h4>
              <p>{{ a.feedback.improvedAnswer }}</p>
            </div>
          </div>
        </details>

        <button class="btn btn-danger btn-sm" (click)="deleteAttempt(a._id)">Delete</button>
      </div>

      <div class="pagination" *ngIf="totalPages > 1">
        <button class="btn btn-secondary" [disabled]="page === 1" (click)="loadPage(page - 1)">Previous</button>
        <span>Page {{ page }} of {{ totalPages }}</span>
        <button class="btn btn-secondary" [disabled]="page === totalPages" (click)="loadPage(page + 1)">Next</button>
      </div>
    </div>
  `,
  styles: [`
    h1 { font-size: 1.75rem; margin-bottom: 0.25rem; }
    .subtitle { color: #94a3b8; margin-bottom: 1.75rem; }
    .attempt-card { margin-bottom: 1rem; }
    .attempt-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }
    .role {
      font-weight: 600;
      color: #38bdf8;
      margin-right: 0.75rem;
    }
    .date { color: #64748b; font-size: 0.85rem; }
    .question {
      margin-bottom: 0.75rem;
      line-height: 1.5;
    }
    details {
      margin-bottom: 1rem;
    }
    summary {
      cursor: pointer;
      color: #38bdf8;
      font-weight: 500;
      margin-bottom: 0.75rem;
    }
    .details-content {
      background: #0f172a;
      padding: 1rem;
      border-radius: 8px;
    }
    .section { margin-bottom: 1rem; }
    .section h4 {
      font-size: 0.95rem;
      color: #94a3b8;
      margin-bottom: 0.4rem;
    }
    ul { padding-left: 1.2rem; }
    .btn-sm { padding: 0.4rem 0.9rem; font-size: 0.85rem; }
    .score-badge {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
    }
    .score-high { background: rgba(34,197,94,0.2); color: #4ade80; }
    .score-mid  { background: rgba(234,179,8,0.2); color: #facc15; }
    .score-low  { background: rgba(239,68,68,0.2); color: #f87171; }
    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-top: 2rem;
    }
    .loading, .empty {
      text-align: center;
      padding: 3rem;
      color: #94a3b8;
    }
  `]
})
export class HistoryComponent implements OnInit {
  attempts: Attempt[] = [];
  loading = true;
  page = 1;
  totalPages = 1;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(p: number) {
    this.loading = true;
    this.page = p;

    this.api.getAttempts(p, 10).subscribe({
      next: (res) => {
        this.attempts = res.data;
        this.totalPages = res.pages;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  deleteAttempt(id: string) {
    if (!confirm('Delete this attempt?')) return;

    this.api.deleteAttempt(id).subscribe({
      next: () => {
        this.attempts = this.attempts.filter(a => a._id !== id);
      }
    });
  }

  getScoreClass(score: number): string {
    if (score >= 7) return 'score-high';
    if (score >= 4) return 'score-mid';
    return 'score-low';
  }
}