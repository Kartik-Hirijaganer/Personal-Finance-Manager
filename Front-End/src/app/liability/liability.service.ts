import { Injectable } from '@angular/core';
import { Observable, Subject, switchMap, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Liability } from './liability.model';
import { UtilService } from '../shared/util.service';
import { environment } from '../../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class LiabilityService {
  public monthlyLiability: number = 0;
  public monthlyLiabilityEvent: Subject<number> = new Subject<number>();
  public liabilityListEvent: Subject<Liability[]> = new Subject<Liability[]>();
  public liabilityEditEvent: Subject<{ action: string, idx: number, payload?: Liability }> = new Subject<{ action: string, idx: number, payload?: Liability }>();
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  })


  constructor(
    private util: UtilService,
    private http: HttpClient
  ) {
    this.getLiabilities().subscribe(() => { });
  }

  addLiability(liability: Liability): Observable<{liabilityId: string}> {
    return this.http.post<{liabilityId: string}>(
      `${environment.URL}:${environment.account_port}/liability/add`, 
      liability, 
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') || '' }),  
        params: { 'category': 'liability', 'accountId': localStorage.getItem('account_id') || '' }
      });
  }

  deleteLiability(id: string): Observable<{liabilityId: string}> {
    return this.http.delete<{liabilityId: string}>(
      `${environment.URL}:${environment.account_port}/liability/delete/${id}`, 
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') || '' }), 
        params: { 'category': 'liability', 'accountId': localStorage.getItem('account_id') || '' }
      });
  }

  updateLiability(liability: Liability): Observable<{ liabilityId: string }> {
    return this.http.put<{ liabilityId: string }>(
      `${environment.URL}:${environment.account_port}/liability/update/${liability.id}`, 
      liability, 
      { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') || ''}),
        params: {'category': 'liability', 'accountId': localStorage.getItem('account_id') || ''}
      });
  }

  // getLiabilities(): Observable<Liability[]> {
  //   return this.http.get<{ liabilities: Liability[] }>(`${environment.URL}:${environment.account_port}/liability`, { headers: this.headers })
  //     .pipe(map(({ liabilities }) => {
  //       this.monthlyLiability = this.util.calculateTotalAmount(liabilities);
  //       this.monthlyLiabilityEvent.next(this.monthlyLiability);
  //       return liabilities;
  //     }));
  // }

  getLiabilities(): Observable<any> {
    return this.http.get<{ liabilities: Liability[] }>(`${environment.URL}:${environment.account_port}/liability`, { headers: this.headers })
      .pipe(map(({ liabilities }) => {
        this.monthlyLiability = this.util.calculateTotalAmount(liabilities);
        this.monthlyLiabilityEvent.next(this.monthlyLiability);
        return this.util.data;
      }));
  }

}