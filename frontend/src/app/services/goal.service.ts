import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Goal {
  id?: number;
  target_year: number;
  target_co2_percentage?: number;
  target_co2?: number;
  company_id: number;
  user_id?: number;
  created_at?: string;
  current_year?: number;
  target_male_percentage?: number;
  target_female_percentage?: number;
  goal_type: string;
  created_by?: string;

}

@Injectable({
  providedIn: 'root',
})
export class GoalService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getGoals(skip: number = 0, limit: number = 10): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${this.apiUrl}/goals/`);
  }

  getGoalById(goalId: number): Observable<Goal> {
    return this.http.get<Goal>(`${this.apiUrl}/goals/${goalId}`);
  }

  getGoalsByUserId(userId: number): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${this.apiUrl}/goals/user/${userId}`);
  }

  getGoalsByCompany(companyId: number): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${this.apiUrl}/goals/company/${companyId}`);
  }

  createGoal(goal: Goal): Observable<Goal> {
    return this.http.post<Goal>(`${this.apiUrl}/goals`, goal);
  }


  updateGoal(goalId: number, goal: Goal): Observable<Goal> {
    return this.http.put<Goal>(`${this.apiUrl}/goals/${goalId}`, goal);
  }

  deleteGoal(goalId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/goals/${goalId}`);
  }
}