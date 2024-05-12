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
    const params = new HttpParams({ fromObject: { type: 'email' } });
    this.http.post<{ token: string, userId: string, accountId: string, user: string, profile_img: string }>(
      `${environment.URL}:${environment.auth_port}/login`,
      payload,
      { params })
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

  logout(): void {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  register(payload: User): Observable<any> {
    return this.http.post<{ userId: string, token: string, accountId: string }>(`${environment.URL}:${environment.auth_port}/register`, payload);
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
    const params = new HttpParams({ fromObject: { type: 'email', reset: 'true' } });
    this.http.get<{ user: any }>(
      `${environment.URL}:${environment.user_port}/user/${payload.email}`,
      { params }
    ).pipe(
      switchMap((res: any) => {
        if (!res?.user) {
          this.toastr.error(`User with email ${payload.email} does not exists.`, 'Error');
          return of(null);
        }
        const updatedUser = { ...res.user, password: payload.pass };
        this.token = res?.token;
        return this.http.put<{ userId: string }>(
          `${environment.URL}:${environment.user_port}/user/update/${updatedUser.userId}`,
          updatedUser
        )
      }),
      catchError(err => {
        this.toastr.error(err?.error?.errorMessage || 'Failed to update password.', 'Unknown Error');
        return of(null);
      })
    ).subscribe(res => {
      if (res?.userId) {
        this.toastr.success('Password updated, kindly login with new password.', 'Success');
        this.showLoginPage = true;
      }
    })
  }
}