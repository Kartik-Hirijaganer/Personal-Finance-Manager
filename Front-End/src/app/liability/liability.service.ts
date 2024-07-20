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
      `${environment.base_url}/${environment.version}/entries/add`, 
      { ...liability, month: this.util.getMonthPayload(liability.due_date) }, 
      {  
        params: { method: 'add_entry', 'category': 'liability', 'accountId': localStorage.getItem('account_id') || '' }
      });
  }

  deleteLiability(id: string): Observable<{liabilityId: string}> {
    return this.http.delete<{liabilityId: string}>(
      `${environment.base_url}/${environment.version}/entries/delete/${id}`, 
      { 
        params: { method: 'delete_entry', 'category': 'liability', 'accountId': localStorage.getItem('account_id') || '' }
      });
  }

  updateLiability(liability: Liability): Observable<{ liabilityId: string }> {
    return this.http.put<{ liabilityId: string }>(
      `${environment.base_url}/${environment.version}/entries/update/${liability.id}`, 
      { ...liability, month: this.util.getMonthPayload(liability.due_date) }, 
      { 
        params: { method: 'update_entry', 'category': 'liability', 'accountId': localStorage.getItem('account_id') || ''}
      });
  }
}