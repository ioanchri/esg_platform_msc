import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvironmentalMetric } from './enviromental_metrics.service';
import { GovernanceMetric } from './governance_metrics.service';
import { SocialMetric } from './social_metrics.service';
import { AuthService } from './auth.service';
import { Goal } from './goal.service';
import { environment } from '../../environments/environment';

export interface Company {
  id: number;
  name: string;
  industry: string;
  contact_email: string;
  website: string;
  phone_number: string;
  number_of_buildings: number;
  year_founded: number;
  country: string;
  city: string;
  address: string;
  postal_code: string;
  metrics?: {
    environmental: EnvironmentalMetric[];
    social: SocialMetric[];
    governance: GovernanceMetric[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private companyId: number | null = null;

  setCompanyId(companyId: number): void {
    this.companyId = companyId;
  }

  getCompanyId(): number | null {
    return this.companyId;
  }
  createCompany(company: Company): Observable<Company> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
    return this.http.post<Company>(`${this.apiUrl}/companies/`, company, {
      headers,
    });
  }
  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.apiUrl}/companies`);
  }
  getCompaniesCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/companies/count`);
  }
  getCompany(companyId: number): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/companies/${companyId}`);
  }

  getCompanyByUserId(userId: string): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/companies/user/${userId}`);
  }

  getIndustries(): Observable<{ industry: string; count: number }[]> {
    return this.http.get<{ industry: string; count: number }[]>(
      `${this.apiUrl}/api/industries`
    );
  }

  getCompanyById(companyId: number): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/companies/${companyId}`);
  }

  updateCompany(companyId: number, company: Company): Observable<Company> {
    return this.http.put<Company>(
      `${this.apiUrl}/companies/${companyId}/`,
      company
    );
  }

  deleteCompany(companyId: number): Observable<Company> {
    return this.http.delete<Company>(`${this.apiUrl}/companies/${companyId}`);
  }

  getCompanyMetrics(companyId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/companies/${companyId}/metrics`);
  }

  getAvailableYears(companyId: number): Observable<number[]> {
    return this.http.get<number[]>(
      `${this.apiUrl}/companies/${companyId}/available_years`
    );
  }

  downloadCompanyPdf(companyId: number, year: number): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/companies/${companyId}/download_pdf?year=${year}`,
      { responseType: 'blob' }
    );
  }

  setCompanyGoal(goal: Goal): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/goals`, goal);
  }

  getHazardousWasteByYear(companyId: number, year?: number): Observable<any> {
    let url = `${this.apiUrl}/companies/${companyId}/hazardous_waste`;
    if (year !== undefined) {
      url += `?year=${year}`;
    }
    return this.http.get<any>(url);
  }

  getWasteDataByYear(companyId: number, year?: number): Observable<any> {
    let url = `${this.apiUrl}/companies/${companyId}/waste_data`;
    if (year !== undefined) {
      url += `?year=${year}`;
    }
    return this.http.get<any>(url);
  }

  getCarDataByYear(companyId: number, year?: number): Observable<any> {
    let url = `${this.apiUrl}/companies/${companyId}/car_data`;
    if (year !== undefined) {
      url += `?year=${year}`;
    }
    return this.http.get<any>(url);
  }

  getGenderRatio(companyId: number, year?: number): Observable<any> {
    let url = `${this.apiUrl}/companies/${companyId}/gender_ratio`;
    if (year !== undefined) {
      url += `?year=${year}`;
    }
    return this.http.get<any>(url);
  }

  getCompensationRatio(companyId: number, year?: number): Observable<any> {
    let url = `${this.apiUrl}/companies/${companyId}/compensation_ratio`;
    if (year !== undefined) {
      url += `?year=${year}`;
    }
    return this.http.get<any>(url);
  }

  getTurnoverRate(companyId: number, year?: number): Observable<any> {
    let url = `${this.apiUrl}/companies/${companyId}/turnover_rate`;
    if (year !== undefined) {
      url += `?year=${year}`;
    }
    return this.http.get<any>(url);
  }

  getEsgScore(companyId: number, year: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/companies/${companyId}/esg_score?year=${year}`);
  }
}
