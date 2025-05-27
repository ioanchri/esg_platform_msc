import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  username: string;
  email: string;
  company_id: number;
  role: string;

}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/username/${username}`);
  }

  checkUsername(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check_username/${username}`);
  }

  checkEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check_email/${email}`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}`);
  }
  
}