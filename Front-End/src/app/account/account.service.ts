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
    const params = new HttpParams({ fromObject: { method: 'get_account' }});
    return this.http.get<Account>(
      `${environment.base_url}/${environment.version}/accounts/${accountId}`,
      { params }
    )
  }

  getAccounts(): Observable<Account[]> {
    const params = new HttpParams({ fromObject: { method: 'get_accounts' } });
    return this.http.get<Account[]>(
      `${environment.base_url}/${environment.version}/accounts/${this.authService.userId}`,
      { params }
    )
  }

  addAccount(payload: Account): Observable<{ accountId: string }> {
    const params = new HttpParams({ fromObject: { method: 'add_account' }});
    return this.http.post<{ accountId: string }>(`${environment.base_url}/${environment.version}/accounts/add`,
     { ...payload, userId: this.authService.userId },
     { params }
    )
  }

  deleteAccount(accountNo: number) {
    const params = new HttpParams({ fromObject: { method: 'delete_account'}})
    return this.http.delete<Account>(
      `${environment.base_url}/${environment.version}/accounts/delete/${accountNo}`,
      { params }
    )
  }
}