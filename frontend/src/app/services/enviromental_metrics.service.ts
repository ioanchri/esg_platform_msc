import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface EnvironmentalMetric {
  id?: number;
  company_id: number;
  electricity_consumption: number;
  gas_consumption: number;
  car_diesel_consumption: number;
  car_fuel_consumption: number;
  car_electricity_consumption: number;
  hazardous_waste: number;
  non_hazardous_waste: number;
  year: number;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class EnvironmentalService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  createEnvironmentalMetric(formData: FormData): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/environmental_metrics/`,
      formData
    );
  }

  getEnvironmentalMetrics(): Observable<EnvironmentalMetric[]> {
    return this.http.get<EnvironmentalMetric[]>(
      `${this.apiUrl}/environmental_metrics/`
    );
  }

  getEnvironmentalMetricById(id: number): Observable<EnvironmentalMetric> {
    return this.http.get<EnvironmentalMetric>(
      `${this.apiUrl}/environmental_metrics/${id}`
    );
  }

  getEnvironmentalMetricsByCompanyId(
    company_id: number
  ): Observable<EnvironmentalMetric[]> {
    return this.http.get<EnvironmentalMetric[]>(
      `${this.apiUrl}/environmental_metrics/company/${company_id}`
    );
  }

  updateEnvironmentalMetric(
    id: number,
    formData: FormData
  ): Observable<EnvironmentalMetric> {
    return this.http.put<EnvironmentalMetric>(
      `${this.apiUrl}/environmental_metrics/${id}`,
      formData
    );
  }

  deleteEnvironmentalMetric(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/environmental_metrics/${id}`
    );
  }

  uploadEnvironmentalMetricPdf(
    metricId: number,
    file: File,
    fileType: string
  ): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
  
    const params = new HttpParams().set('file_type', fileType);
  
    return this.http.post<any>(
      `${this.apiUrl}/environmental_metrics/${metricId}/upload_pdf`,
      formData,
      { headers, params }
    );
  }

  deleteEnvironmentalMetricPdf(metricId: number, fileType: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    return this.http.delete<any>(`${this.apiUrl}/environmental_metrics/${metricId}/delete_pdf`, { headers, params: { file_type: fileType } });
  }

  downloadEnvironmentalMetricPdf(metricId: number, fileType: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    return this.http.get(`${this.apiUrl}/environmental_metrics/${metricId}/download_pdf`, { headers, responseType: 'blob', params: { file_type: fileType } });
  }
}
