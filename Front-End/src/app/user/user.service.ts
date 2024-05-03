import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment.dev';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor ( private http: HttpClient ) {}

  addUser(payload: any): Observable<any> {
    const { repass, ...newUser } = payload;
    return this.http.post(`${environment.URL}:${environment.user_port}/user/add`, newUser, { headers: { 'Content-Type': 'application/json' }});
  }

  getUser(userId: string): Observable<any> {
    return this.http.get(`${environment.URL}:${environment.user_port}/user/${userId}`, { headers: { 'Content-Type': 'application/json' } });
  }

  validatePassword(pass: string, repass: string): boolean {
    return pass === repass;
  }

}