import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { User } from '../services/user.service';
import { UserService } from './user.service';
import { environment } from '../../environments/environment';

interface LoginResponse {
  access_token: string;
  token_type: string;
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = environment.authUrl;

  constructor(private http: HttpClient, private userService: UserService) {}

  login(username: string, password: string): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const body = new HttpParams()
      .set('username', username)
      .set('password', password);

    return this.http
      .post<LoginResponse>(`${this.authUrl}/token`, body.toString(), {
        headers,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('username', response.username);
        }),
        switchMap(() => this.userService.getUserByUsername(username)),
        tap((user) => {
          localStorage.setItem('role', user.role);
        }),
        map(() => ({ access_token: localStorage.getItem('access_token')!, token_type: 'bearer', username }))
      );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/register`, {
      username,
      email,
      password,
    });
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  isAdmin(): boolean {
    const role = localStorage.getItem('role');
    const isAdmin = role === 'admin';
    return isAdmin;
  }

  hasCompany(): Observable<boolean> {
    const username = this.getUsername();
    if (username) {
      return this.getUserByUsername(username).pipe(
        map((user: User) => !!user.company_id)
      );
    }
    return of(false);
  }
  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getUserByUsername(username: string): Observable<User> {
    return this.userService.getUserByUsername(username);
  }

  getCompanyId(): Observable<number | null> {
    const username = this.getUsername();
    if (username) {
      return this.getUserByUsername(username).pipe(
        map((user: User) => user.company_id)
      );
    }
    return of(null);
  }

  changePassword(
    currentPassword: string,
    newPassword: string
  ): Observable<any> {
    const username = this.getUsername();
    return this.http.post(`${this.authUrl}/change-password`, {
      username,
      currentPassword,
      newPassword,
    });
  }

  resetPassword(userId: number): Observable<void> {
    return this.http.put<void>(`${this.authUrl}/users/${userId}/reset-password`, {});
  }
}
