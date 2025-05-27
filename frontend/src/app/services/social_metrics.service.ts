import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SocialMetric {
  id?: number;
  company_id: number;
  employee_satisfaction: number;
  diversity_inclusion: number;
  community_engagement: number;
  year: number;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class SocialService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createSocialMetric(metric: SocialMetric): Observable<SocialMetric> {
    return this.http.post<SocialMetric>(`${this.apiUrl}/social_metrics/`, metric);
  }

  getSocialMetrics(): Observable<SocialMetric[]> {
    return this.http.get<SocialMetric[]>(`${this.apiUrl}/social_metrics/`);
  }
  getSocialMetricById(id: number): Observable<SocialMetric> {
    return this.http.get<SocialMetric>(`${this.apiUrl}/social_metrics/${id}`);
  }

  getSocialMetricsByCompanyId(company_id: number): Observable<SocialMetric[]> {
    return this.http.get<SocialMetric[]>(`${this.apiUrl}/social_metrics/company/${company_id}`);
  }

  updateSocialMetric(id: number, metric: SocialMetric): Observable<SocialMetric> {
    return this.http.put<SocialMetric>(`${this.apiUrl}/social_metrics/${id}`, metric);
  }

  deleteSocialMetric(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/social_metrics/${id}`);
  }
}
