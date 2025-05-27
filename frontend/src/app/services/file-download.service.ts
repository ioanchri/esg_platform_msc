import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { enviroment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileDownloadService {
  private apiUrl = enviroment.apiUrl 

  constructor(private http: HttpClient) {}

  downloadFile(filePath: string): Observable<Blob> {
    const url = `${this.apiUrl}/${filePath}`;
    return this.http.get(url, { responseType: 'blob' });
  }
}