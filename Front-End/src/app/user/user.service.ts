import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

import { environment } from '../../environments/environment.dev';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public profile_img: string = 'https://www.w3schools.com/howto/img_avatar.png';
  public user_fname: string = '';
  public userId: string = '';
  public userEvent: Subject<{ user_fname: string, profile_img: string, userId: string }> = new Subject<{ user_fname: string, profile_img: string, userId: string }>();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  updateUser(payload: any): Observable<any> {
    const { repass, ...newUser } = payload;
    this.profile_img = payload.profile_img;
    this.user_fname = payload.fname;
    return this.http.put<{ userId: string, token: string }>(`${environment.URL}:${environment.user_port}/user/update/${payload.userId}`, newUser, { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.authService.getToken() }) });
  }

  getUser(userId: string): Observable<any> {
    return this.http.get(`${environment.URL}:${environment.user_port}/user/${userId}`, { headers: { 'Content-Type': 'application/json', 'Authorization': this.authService.getToken() } });
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${environment.URL}:${environment.user_port}/user/delete/${userId}`, { headers: { 'Content-Type': 'application/json', 'Authorization': this.authService.getToken() } });
  }

  validatePassword(pass: string, repass: string): boolean {
    return pass === repass;
  }
}