import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { User, UserLoginData } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();
  private API_URL = `${environment.apiURL}/User`;
  http: HttpClient = inject(HttpClient)
  router: Router = inject(Router)

  constructor() {
    const token = this.getToken();
    this.isLoggedInSubject.next(!!token);
   };

  signupUser(user: any): Observable<any> {
    return this.http.post(`${this.API_URL}/SignupUser`, user);
  };

  check_duplicate_email(email: string): Observable<{ msg: string}> {
    return this.http.get<{ msg: string }>(`${this.API_URL}/CheckDuplicateEmail/${email}`)
  };

  check_duplicate_username(username: string): Observable<{ msg: string}> {
    return this.http.get<{ msg: string }>(`${this.API_URL}/CheckDuplicateUsername/${username}`)
  };

  loginUser(user: UserLoginData): Observable<{ token: string, role: string, username: string }> {
    return this.http.post<{ token: string; role: string; username: string }>(`${this.API_URL}/LoginUser`, user);
  };

  // Save the JWT token and user role
  saveUserSession(token: string, role: string, username: string): void {
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('userRole', role);
    sessionStorage.setItem('username', username);
    this.isLoggedInSubject.next(true); // Update the login status
  };

  getToken(): string | null {
    return sessionStorage.getItem('authToken');
  };

  getUserRole(): string | null {
    return sessionStorage.getItem('userRole');
  };

  getUsername(): string | null {
    return sessionStorage.getItem('username');
  };

  logout(): void {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('username');
    this.isLoggedInSubject.next(false); // Update the login status
    this.router.navigate(['/login']);
  };

  getAllUsersFiltered(filters: any, pageNumber: number, pageSize: number): Observable<{ users: User[], totalCount: number }> {
    let params = new HttpParams()
    .set('pageNumber', pageNumber.toString())
    .set('pageSize', pageSize.toString());

    for (const key in filters) {
    if (filters[key]) {
        params = params.set(key, filters[key]);
    }
  }

    return this.http.get<{ users: User[], totalCount: number }>(`${this.API_URL}/GetAllUsersFiltered`, { params });
}
}
