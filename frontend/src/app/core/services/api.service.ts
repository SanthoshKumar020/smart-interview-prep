import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Question {
  question: string;
  difficulty: string;
  topic: string;
  expectedFocus: string;
}

export interface Attempt {
  _id: string;
  role: string;
  question: string;
  userAnswer: string;
  score: number;
  feedback: {
    strengths: string[];
    improvements: string[];
    improvedAnswer: string;
    followUpQuestions: string[];
  };
  createdAt: string;
}

export interface Stats {
  totalAttempts: number;
  averageScore: number;
  roleStats: { role: string; attempts: number; averageScore: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  generateQuestions(role: string, level: string = 'mid', count: number = 5, topics: string[] = []) {
    return this.http.post<{ success: boolean; data: Question[] }>(`${this.API}/questions/generate`, {
      role, level, count, topics
    });
  }

  submitAttempt(role: string, question: string, userAnswer: string) {
    return this.http.post<{ success: boolean; data: Attempt }>(`${this.API}/attempts`, {
      role, question, userAnswer
    });
  }

  getAttempts(page: number = 1, limit: number = 10) {
    return this.http.get<{ success: boolean; data: Attempt[]; total: number; pages: number }>(
      `${this.API}/attempts?page=${page}&limit=${limit}`
    );
  }

  getAttempt(id: string) {
    return this.http.get<{ success: boolean; data: Attempt }>(`${this.API}/attempts/${id}`);
  }

  deleteAttempt(id: string) {
    return this.http.delete<{ success: boolean; message: string }>(`${this.API}/attempts/${id}`);
  }

  getStats() {
    return this.http.get<{ success: boolean; data: Stats }>(`${this.API}/attempts/stats`);
  }
}