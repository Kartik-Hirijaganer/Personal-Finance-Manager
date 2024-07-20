import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
    const params = new HttpParams({ fromObject: { method: 'update_user' }});
    return this.http.put<{ userId: string, token: string }>(`${environment.base_url}/${environment.version}/users/update/${this.userId}`, payload, { params });
  }

  getUser(userId: string): Observable<any> {
    const params = new HttpParams({ fromObject: { method: 'get_user' } });
    return this.http.get(`${environment.base_url}/${environment.version}/users/${userId}`, { params });
  }

  deleteUser(userId: string): Observable<any> {
    const params = new HttpParams({ fromObject: { method: 'delete_user' } });
    return this.http.delete(`${environment.base_url}/${environment.version}/users/delete/${userId}`, { params });
  }

  validatePassword(pass: string, repass: string): boolean {
    return pass === repass;
  }
}