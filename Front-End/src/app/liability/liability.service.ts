import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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

  constructor ( private util: UtilService, private http: HttpClient ) { }

  addLiability(liability: Liability): Observable<{liabilityId: string}> {
    return this.http.post<{liabilityId: string}>(
      `${environment.URL}:${environment.account_port}/liability/add`, 
      { ...liability, month: this.util.getMonthPayload(liability.due_date) }, 
      {  
        params: { 'category': 'liability', 'accountId': localStorage.getItem('account_id') || '' }
      });
  }

  deleteLiability(id: string): Observable<{liabilityId: string}> {
    return this.http.delete<{liabilityId: string}>(
      `${environment.URL}:${environment.account_port}/liability/delete/${id}`, 
      { 
        params: { 'category': 'liability', 'accountId': localStorage.getItem('account_id') || '' }
      });
  }

  updateLiability(liability: Liability): Observable<{ liabilityId: string }> {
    return this.http.put<{ liabilityId: string }>(
      `${environment.URL}:${environment.account_port}/liability/update/${liability.id}`, 
      { ...liability, month: this.util.getMonthPayload(liability.due_date) }, 
      { 
        params: {'category': 'liability', 'accountId': localStorage.getItem('account_id') || ''}
      });
  }
}