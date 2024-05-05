import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

import { environment } from '../../environments/environment.dev';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoginMode: boolean = false;
  constructor(private http: HttpClient, private toastr: ToastrService ) { }

  login(payload: {email: string, password: string}) {
    this.http.post('http://localhost:3350/login', payload, { headers: {'Content-Type': 'application/json', type: 'email'}})
    .pipe(
      catchError(err => {
        this.toastr.error(err?.error?.errorMessage || 'Invalid email or password', 'Failed to login');
        return of(null);
      })
    )
    .subscribe(response => {
      if (response) {
        this.isLoginMode = !this.isLoginMode;
      }
    });
  }
}