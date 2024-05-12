import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Income } from "./income.model";
import { UtilService } from "../shared/util.service";
import { environment } from "../../environments/environment.dev";

@Injectable({ providedIn: 'root' })
export class IncomeService {
  public monthlyIncome: number = 0;
  public incomeListEvent: Subject<Income[]> = new Subject<Income[]>();
  public monthlyIncomeEvent: Subject<number> = new Subject<number>();
  public incomeEditEvent: Subject<{ action: string, idx: number, payload?: Income }> = new Subject<{ action: string, idx: number, payload?: Income }>();

  constructor ( private util: UtilService, private http: HttpClient ) { }

  addIncome(income: Income): Observable<{incomeId: string}> {
    return this.http.post<{incomeId: string}>(
      `${environment.URL}:${environment.account_port}/income/add`, 
      { ...income, month: this.util.getMonthPayload(income.date) }, 
      {
        params: { 'category': 'income', 'accountId': localStorage.getItem('account_id') || '' }
      });
  }

  deleteIncome(id: string): Observable<{incomeId: string}> {
    return this.http.delete<{ incomeId: string }>(
      `${environment.URL}:${environment.account_port}/income/delete/${id}`, 
      {
        params: { 'category': 'income', 'accountId': localStorage.getItem('account_id') || '' } 
      });
  }

  updateIncome(income: Income): Observable<{incomeId: string}> {
    return this.http.put<{ incomeId: string }>(
      `${environment.URL}:${environment.account_port}/income/update/${income.id}`, 
      { ...income, month: this.util.getMonthPayload(income.date) }, 
      {
        params: { 'category': 'income', 'accountId': localStorage.getItem('account_id') || '' }
      }
    )
  }
}