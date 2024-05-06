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
    this.http.post<{ token: string, userId: string }>(`${environment.URL}:${environment.auth_port}/login`, payload, { headers: { 'Content-Type': 'application/json', type: 'email' } })
      .pipe(
        catchError(err => {
          this.toastr.error(err?.error?.errorMessage || 'Invalid email or password', 'Failed to login');
          return of(null);
        })
      )
      .subscribe(response => {
        if (response) {
          this.setToken(response.token);
          this.router.navigateByUrl(`/dashboard/${response.userId}`);
        }
      });
  }

  register(payload: User): Observable<any> {
    return this.http.post(`${environment.URL}:${environment.auth_port}/register`, payload);
  }

  public setToken(token: string): void {
    this.token = token;
    this.isLoginMode = !this.isLoginMode;
  }

  public getToken(): string {
    return this.token;
  }

  public logout(): void {
    this.setToken('');
    this.router.navigateByUrl('/');
  }
}