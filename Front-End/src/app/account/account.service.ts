import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

import { environment } from '../../environments/environment.dev';
import { AuthService } from '../auth/auth.service';
import { Account } from './account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private incomeUrl: string = `${environment.URL}:${environment.auth_port}/income`;
  private expenseUrl: string = `${environment.URL}:${environment.auth_port}/expense`;
  private liabilityUrl: string = `${environment.URL}:${environment.auth_port}/liability`;
  public accountSelectEvent: Subject<any> = new Subject<any>();

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getAccountDetails(accountId: string): Observable<Account> {
    return this.http.get<Account>(
      `${environment.URL}:${environment.account_port}/account/${accountId}`,
      {
        headers: { 'Authorization': this.authService.getToken(), 'Content-Type': 'application/json' }
      }
    )
  }

  getAccounts(): Observable<Account[]> {
    const options = {
      headers: { 'Authorization': this.authService.getToken(), 'Content-Type': 'application/json', 'user-type': 'new' },
      params: new HttpParams().set('userId', localStorage.getItem('user_id') || '')
    }
    return this.http.get<Account[]>(
      `${environment.URL}:${environment.account_port}/accounts`,
      options
    )
  }

  addAccount(payload: Account): Observable<any> {
    return this.http.post<{accountId: string}>(`${environment.URL}:${environment.account_port}/account/add`,
     { ...payload, userId: localStorage.getItem('user_id') },
      {
        headers: { 'Authorization': this.authService.getToken(), 'Content-Type': 'application/json' }
      }
    )
  }
}