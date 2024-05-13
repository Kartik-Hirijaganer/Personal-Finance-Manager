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
  public accountSelectEvent: Subject<{accountNo: number, accountSource: string, descrption: string, accountId: string}> = new Subject<{accountNo: number, accountSource: string, descrption: string, accountId: string}>();
  public accountEditEvent: Subject<{ action: string, idx: number, payload?: Account }> = new Subject<{ action: string, idx: number, payload?: Account }>();

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getAccountDetails(accountId: string): Observable<Account> {
    return this.http.get<Account>(
      `${environment.URL}:${environment.account_port}/account/${accountId}`
    )
  }

  getAccounts(): Observable<Account[]> {
    const params = new HttpParams({ fromObject: { userId: this.authService.userId, userType: 'new' } });
    return this.http.get<Account[]>(
      `${environment.URL}:${environment.account_port}/accounts`,
      { params }
    )
  }

  addAccount(payload: Account): Observable<{ accountId: string }> {
    return this.http.post<{accountId: string}>(`${environment.URL}:${environment.account_port}/account/add`,
     { ...payload, userId: this.authService.userId }
    )
  }

  deleteAccount(accountNo: number) {
    return this.http.delete<Account>(
      `${environment.URL}:${environment.account_port}/account/delete/${accountNo}`
    )
  }
}