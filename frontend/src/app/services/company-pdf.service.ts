import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CompanyPdfService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  uploadCompanyPdf(companyId: number, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    return this.http.post<any>(`${this.apiUrl}/companies/${companyId}/upload_pdf`, formData, { headers });
  }

  downloadCompanyPdfTest(companyId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/companies/${companyId}/download_pdf`, { responseType: 'blob' });
  }

  deleteCompanyPdf(companyId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    return this.http.delete<any>(`${this.apiUrl}/companies/${companyId}/delete_pdf`, { headers });
  }

  downloadCompanyReport(companyId: number, year: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/companies/${companyId}/download_report?year=${year}`, { responseType: 'blob' });
  }
  
}