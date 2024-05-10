import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { Income } from "./income.model";
import { UtilService } from "../shared/util.service";
import { environment } from "../../environments/environment.dev";

@Injectable({ providedIn: 'root' })
export class IncomeService {
  public monthlyIncome: number = 0;
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  })
  public incomeListEvent: Subject<Income[]> = new Subject<Income[]>();
  public monthlyIncomeEvent: Subject<number> = new Subject<number>();
  public incomeEditEvent: Subject<{ action: string, idx: number, payload?: Income }> = new Subject<{ action: string, idx: number, payload?: Income }>();

  constructor(
    private util: UtilService,
    private http: HttpClient
  ) { }

  addIncome(income: Income): Observable<{incomeId: string}> {
    return this.http.post<{incomeId: string}>(
      `${environment.URL}:${environment.account_port}/income/add`, 
      income, 
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') || ''
        }),
        params: { 'category': 'income', 'accountId': localStorage.getItem('account_id') || '' }
      });
  }

  deleteIncome(id: string): Observable<{incomeId: string}> {
    return this.http.delete <{ incomeId: string }>(
      `${environment.URL}:${environment.account_port}/income/delete/${id}`, 
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') || ''
        }),
        params: { 'category': 'income', 'accountId': localStorage.getItem('account_id') || '' } 
      });
  }

  updateIncome(income: Income): Observable<{incomeId: string}> {
    return this.http.put<{ incomeId: string }>(
      `${environment.URL}:${environment.account_port}/income/update/${income.id}`, 
      income, 
      { headers: new HttpHeaders({ 'Authorization': localStorage.getItem('token') || '', 'Content-Type': 'application/json' }),
        params: { 'category': 'income', 'accountId': localStorage.getItem('account_id') || '' }
      }
    )
  }

  // getIncomes(): Observable<Income[]> {
  //   return this.http.get<{ incomes: Income[] }>(`${environment.URL}:${environment.income_port}/income`, { headers: this.headers })
  //     .pipe(map(({ incomes }) => {
  //       this.monthlyIncome = this.util.calculateTotalAmount(incomes);
  //       this.monthlyIncomeEvent.next(this.monthlyIncome);
  //       return incomes;
  //     }));
  // }

  getIncomes(): Observable<any> {
    return this.http.get<{ incomes: Income[] }>(`${environment.URL}:${environment.income_port}/income`, { headers: this.headers })
      .pipe(map(({ incomes }) => {
        this.monthlyIncome = this.util.calculateTotalAmount(incomes);
        this.monthlyIncomeEvent.next(this.monthlyIncome);
        return this.util.data;
      }));
  }
}