import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public profile_img: string = 'https://www.w3schools.com/howto/img_avatar.png';
  public user_fname: string = '';
  public userId: string = '';

  constructor(private http: HttpClient) { }

  addUser(payload: any): Observable<any> {
    const { repass, ...newUser } = payload;
    if (payload.profile_img) {
      this.profile_img = payload.profile_img
    } else {
      payload.profile_img = 'https://www.w3schools.com/howto/img_avatar.png';
    }
    if (payload.fname) {
      this.user_fname = payload.fname;
    }
    return this.http.post(`${environment.URL}:${environment.user_port}/user/add`, newUser, { headers: { 'Content-Type': 'application/json' } });
  }

  getUser(userId: string): Observable<any> {
    return this.http.get(`${environment.URL}:${environment.user_port}/user/${userId}`, { headers: { 'Content-Type': 'application/json' } });
  }

  validatePassword(pass: string, repass: string): boolean {
    return pass === repass;
  }
}