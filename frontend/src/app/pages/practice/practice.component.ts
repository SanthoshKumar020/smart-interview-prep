import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Question, Attempt } from '../../core/services/api.service';

@Component({
  selector: 'app-practice',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h1>Practice Interview</h1>
      <p class="subtitle">Select a role and get AI-generated questions</p>

      <!-- Step 1: Role Selection -->
      <div class="card" *ngIf="step === 'role'">
        <div class="form-group">
          <label>Target Role</label>
          <input class="form-control" [(ngModel)]="role" placeholder="e.g. Data Engineer, Full Stack Developer, Product Manager">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Level</label>
            <select class="form-control" [(ngModel)]="level">
              <option value="junior">Junior</option>
              <option value="mid">Mid-level</option>
              <option value="senior">Senior</option>
            </select>
          </div>
          <div class="form-group">
            <label>Number of Questions</label>
            <select class="form-control" [(ngModel)]="count">
              <option [value]="3">3</option>
              <option [value]="5">5</option>
              <option [value]="8">8</option>
            </select>
          </div>
        </div>
        <div *ngIf="error" class="alert alert-error">{{ error }}</div>
        <button class="btn btn-primary" (click)="generateQuestions()" [disabled]="!role || loading">
          {{ loading ? 'Generating...' : 'Generate Questions' }}
        </button>
      </div>

      <!-- Step 2: Questions List -->
      <div *ngIf="step === 'questions'">
        <div class="questions-header">
          <h2>Questions for {{ role }}</h2>
          <button class="btn btn-secondary" (click)="reset()">Change Role</button>
        </div>

        <div *ngFor="let q of questions; let i = index" class="card question-card">
          <div class="q-header">
            <span class="q-number">Q{{ i + 1 }}</span>
            <span class="badge" [class]="'diff-' + q.difficulty">{{ q.difficulty }}</span>
            <span class="topic">{{ q.topic }}</span>
          </div>
          <p class="q-text">{{ q.question }}</p>
          <p class="focus"><strong>Focus:</strong> {{ q.expectedFocus }}</p>
          <button class="btn btn-primary btn-sm" (click)="selectQuestion(q)">Answer this</button>
        </div>
      </div>

      <!-- Step 3: Answer Form -->
      <div class="card" *ngIf="step === 'answer' && selectedQuestion">
        <button class="btn btn-secondary btn-sm back-btn" (click)="step = 'questions'">← Back to questions</button>
        <h2>Your Answer</h2>
        <p class="q-text">{{ selectedQuestion.question }}</p>

        <div class="form-group">
          <label>Write your answer</label>
          <textarea class="form-control" rows="8" [(ngModel)]="userAnswer"
                    placeholder="Type your detailed answer here..."></textarea>
        </div>

        <div *ngIf="error" class="alert alert-error">{{ error }}</div>

        <button class="btn btn-primary" (click)="submitAnswer()" [disabled]="!userAnswer || loading">
          {{ loading ? 'Evaluating with AI...' : 'Submit & Get Feedback' }}
        </button>
      </div>

      <!-- Step 4: Feedback -->
      <div *ngIf="step === 'feedback' && result" class="feedback-section">
        <div class="card score-card">
          <div class="score-circle" [class]="getScoreClass(result.score)">
            {{ result.score }}/10
          </div>
          <h2>AI Evaluation</h2>
        </div>

        <div class="card">
          <h3>Strengths</h3>
          <ul>
            <li *ngFor="let s of result.feedback.strengths">{{ s }}</li>
          </ul>
        </div>

        <div class="card">
          <h3>Areas to Improve</h3>
          <ul>
            <li *ngFor="let i of result.feedback.improvements">{{ i }}</li>
          </ul>
        </div>

        <div class="card">
          <h3>Improved Sample Answer</h3>
          <p class="improved">{{ result.feedback.improvedAnswer }}</p>
        </div>

        <div class="card" *ngIf="result.feedback.followUpQuestions?.length">
          <h3>Follow-up Questions</h3>
          <ul>
            <li *ngFor="let f of result.feedback.followUpQuestions">{{ f }}</li>
          </ul>
        </div>

        <div class="actions">
          <button class="btn btn-primary" (click)="step = 'questions'">Answer another question</button>
          <button class="btn btn-secondary" (click)="reset()">Start new session</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    h1 { font-size: 1.75rem; margin-bottom: 0.25rem; }
    .subtitle { color: #94a3b8; margin-bottom: 1.75rem; }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .questions-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
    }
    .question-card {
      margin-bottom: 1rem;
    }
    .q-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }
    .q-number {
      font-weight: 700;
      color: #38bdf8;
    }
    .badge {
      font-size: 0.75rem;
      padding: 0.2rem 0.6rem;
      border-radius: 999px;
      text-transform: capitalize;
    }
    .diff-easy { background: rgba(34,197,94,0.2); color: #4ade80; }
    .diff-medium { background: rgba(234,179,8,0.2); color: #facc15; }
    .diff-hard { background: rgba(239,68,68,0.2); color: #f87171; }
    .topic { color: #94a3b8; font-size: 0.85rem; }
    .q-text {
      font-size: 1.05rem;
      margin-bottom: 0.5rem;
      line-height: 1.6;
    }
    .focus {
      color: #94a3b8;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }
    .btn-sm { padding: 0.5rem 1rem; font-size: 0.875rem; }
    .back-btn { margin-bottom: 1rem; }
    .score-card {
      text-align: center;
      margin-bottom: 1.25rem;
    }
    .score-circle {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 auto 1rem;
    }
    .score-high { background: rgba(34,197,94,0.2); color: #4ade80; }
    .score-mid  { background: rgba(234,179,8,0.2); color: #facc15; }
    .score-low  { background: rgba(239,68,68,0.2); color: #f87171; }
    .card { margin-bottom: 1rem; }
    .card h3 {
      font-size: 1.05rem;
      margin-bottom: 0.75rem;
      color: #38bdf8;
    }
    ul {
      padding-left: 1.25rem;
    }
    li { margin-bottom: 0.4rem; }
    .improved {
      line-height: 1.7;
      color: #cbd5e1;
    }
    .actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
      flex-wrap: wrap;
    }
  `]
})
export class PracticeComponent {
  step: 'role' | 'questions' | 'answer' | 'feedback' = 'role';
  role = '';
  level = 'mid';
  count = 5;
  questions: Question[] = [];
  selectedQuestion: Question | null = null;
  userAnswer = '';
  result: Attempt | null = null;
  loading = false;
  error = '';

  constructor(private api: ApiService) {}

  generateQuestions() {
    this.loading = true;
    this.error = '';

    this.api.generateQuestions(this.role, this.level, this.count).subscribe({
      next: (res) => {
        this.questions = res.data;
        this.step = 'questions';
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to generate questions. Check your AI API key.';
        this.loading = false;
      }
    });
  }

  selectQuestion(q: Question) {
    this.selectedQuestion = q;
    this.userAnswer = '';
    this.step = 'answer';
  }

  submitAnswer() {
    if (!this.selectedQuestion) return;

    this.loading = true;
    this.error = '';

    this.api.submitAttempt(this.role, this.selectedQuestion.question, this.userAnswer).subscribe({
      next: (res) => {
        this.result = res.data;
        this.step = 'feedback';
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to evaluate answer.';
        this.loading = false;
      }
    });
  }

  reset() {
    this.step = 'role';
    this.questions = [];
    this.selectedQuestion = null;
    this.userAnswer = '';
    this.result = null;
    this.error = '';
  }

  getScoreClass(score: number): string {
    if (score >= 7) return 'score-high';
    if (score >= 4) return 'score-mid';
    return 'score-low';
  }
}