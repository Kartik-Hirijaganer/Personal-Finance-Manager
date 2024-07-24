import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, switchMap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment.dev';
import { User } from '../user/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoginMode: boolean = true;
  public showLoginPage: boolean = true;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) { }

  login(payload: { email: string, password: string }): void {
    const params = new HttpParams({ fromObject: { method: 'login' }});
    this.http.post<{ message: string, response: { token: string, userId: string, accountId: string, user: string, profile_img: string } }>(
      `${environment.base_url}/${environment.version}/auth/login`,
      payload,
      { params }
    ).pipe(
        catchError(err => {
          this.toastr.error(err?.error?.message || 'Invalid email or password', 'Failed to login');
          return of(null);
        })
      )
      .subscribe(res => {
        if (res?.response) {
          this.setUser(res?.response);
          this.toastr.success('Login successfull', 'Success');
          this.router.navigate(['/dashboard']);
        }
      });
  }

  logout(): void {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  register(payload: User): Observable<{ message: string, response: { userId: string, token: string, accountId: string, user: string } }> {
    const params = new HttpParams({ fromObject: { method: 'register' }});
    return this.http.post<{ message: string, response: { userId: string, token: string, accountId: string, user: string } }>(
      `${environment.base_url}/${environment.version}/auth/register`, 
      payload,
      { params }
    );
  }

  public setUser(response: { token: string, userId: string, accountId: string, user: string, profile_img: string }): void {
    localStorage.setItem("token", response.token);
    localStorage.setItem("user_id", response.userId);
    localStorage.setItem("account_id", response.accountId);
    localStorage.setItem("user_name", response.user);
    localStorage.setItem("profile_img", response.profile_img);
  }

  get token(): string {
    return localStorage.getItem("token") || "";
  }

  get userId() {
    return localStorage.getItem('user_id') || '';
  }

  set token(token: string) {
    localStorage.setItem('token', token);
  }

  resetUserPassword(payload: { email: string, pass: string }) {
    const params = new HttpParams({ fromObject: { method: 'reset' } });
    return this.http.post<{ message: string, response: { token: string, userId: string, accountId: string, user: string, profile_img: string } }>(
      `${environment.base_url}/${environment.version}/auth/reset`, 
      payload,
      { params }
    ).pipe(
      catchError(err => {
        console.log(err);
        
        this.toastr.error(err?.error?.message || 'Failed to update password.', 'Unknown Error');
        return of(null);
      })
    ).subscribe(res => {
      if (res?.response) {
        this.setUser(res?.response);
        this.toastr.success(res?.message, 'Success');
        this.router.navigate(['/dashboard']);
      }
    })
  }
}