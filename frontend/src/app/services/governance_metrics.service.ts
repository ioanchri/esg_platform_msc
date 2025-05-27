import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface GovernanceMetric {
  id?: number;
  company_id: number;
  anti_corruption_text: string;
  whistleblowing_text: string;
  business_conduct_text: string;
  corporate_culture_text: string;
  year: number;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class GovernanceService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createGovernanceMetric(metric: GovernanceMetric): Observable<GovernanceMetric> {
    return this.http.post<GovernanceMetric>(`${this.apiUrl}/governance_metrics/`, metric);
  }

  getGovernanceMetrics(): Observable<GovernanceMetric[]> {
    return this.http.get<GovernanceMetric[]>(`${this.apiUrl}/governance_metrics/`);
  }

  getGovernanceMetricsByCompanyId(company_id: number): Observable<GovernanceMetric[]> {
    return this.http.get<GovernanceMetric[]>(`${this.apiUrl}/governance_metrics/company/${company_id}`);
  }

  getGovernanceMetric(id: number): Observable<GovernanceMetric> {
    return this.http.get<GovernanceMetric>(`${this.apiUrl}/governance_metrics/${id}`);
  }

  updateGovernanceMetric(id: number, metric: GovernanceMetric): Observable<GovernanceMetric> {
    return this.http.put<GovernanceMetric>(`${this.apiUrl}/governance_metrics/${id}/`, metric);
  }

  deleteGovernanceMetric(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/governance_metrics/${id}`);
  }

  getGovernanceMetricsGoals(companyId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/governance-metrics/percentage/${companyId}`);
  }
}
