import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

import { environment } from '../../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public profile_img: string = 'https://www.w3schools.com/howto/img_avatar.png';
  public user_fname: string = '';
  public userId: string = localStorage.getItem('user_id') || '';
  public userEvent: Subject<{ user_fname: string, profile_img: string, userId: string }> = new Subject<{ user_fname: string, profile_img: string, userId: string }>();

  constructor(
    private http: HttpClient
  ) { }

  updateUser(payload: any): Observable<{ userId: string, token: string }> {
    delete payload.repass;
    this.profile_img = payload.profile_img;
    this.user_fname = payload.fname;
    return this.http.put<{ userId: string, token: string }>(`${environment.URL}:${environment.user_port}/user/update/${this.userId}`, payload);
  }

  getUser(userId: string): Observable<any> {
    return this.http.get(`${environment.URL}:${environment.user_port}/user/${userId}`);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${environment.URL}:${environment.user_port}/user/delete/${userId}`);
  }

  validatePassword(pass: string, repass: string): boolean {
    return pass === repass;
  }
}