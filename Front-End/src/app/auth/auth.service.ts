import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment.dev';
import { User } from '../user/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoginMode: boolean = true;
  private token: string = '';

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) { }

  login(payload: { email: string, password: string }): void {
    this.http.post<{ token: string, userId: string, accountId: string, user: string, profile_img: string }>(`${environment.URL}:${environment.auth_port}/login`, payload, { headers: { 'Content-Type': 'application/json', type: 'email' } })
      .pipe(
        catchError(err => {
          this.toastr.error(err?.error?.errorMessage || 'Invalid email or password', 'Failed to login');
          return of(null);
        })
      )
      .subscribe(response => {
        if (response) {
          this.setUser(response);
          this.toastr.success('Login successfull', 'Success');
          this.router.navigate(['/dashboard']);
        }
      });
  }

  register(payload: User): Observable<any> {
    return this.http.post<{ userId: string, token: string, accountId: string }>(`${environment.URL}:${environment.auth_port}/register`, payload);
  }

  public setUser(response: {token: string, userId: string, accountId: string, user: string, profile_img: string}): void {
    localStorage.setItem("token", response.token);
    localStorage.setItem("user_id", response.userId);
    localStorage.setItem("account_id", response.accountId);
    localStorage.setItem("user_name", response.user);
    localStorage.setItem("profile_img", response.profile_img);
  }

  public getToken(): string {
    return localStorage.getItem("token") || "";
  }

}