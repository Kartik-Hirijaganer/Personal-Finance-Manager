import { Injectable } from '@angular/core';
import { Observable, Subject, map, switchMap } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Expense } from './expense.model';
import { UtilService } from '../shared/util.service';
import { environment } from '../../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  })
  public monthlyExpense: number = 0;
  public monthlyExpenseEvent: Subject<number> = new Subject<number>();
  public expenseEvent: Subject<Expense[]> = new Subject<Expense[]>();
  public expenseEditEvent: Subject<{ action: string, idx: number, payload?: Expense }> = new Subject<{ action: string, idx: number, payload?: Expense }>();

  constructor(
    private util: UtilService,
    private http: HttpClient
  ) {
    this.getExpenses().subscribe(() => { });
  }

  addExpense(expense: Expense): Observable<Expense[]> {
    return this.http.post<{ expenseId: string }>(`${environment.URL}:${environment.expense_port}/expense/add`, expense, { headers: this.headers })
      .pipe(
        switchMap(postResponse => {
          return this.getExpenses();
        })
      )
  }

  deleteExpense(id: string): Observable<Expense[]> {
    return this.http.delete(`${environment.URL}:${environment.expense_port}/expense/delete/${id}`, { headers: this.headers })
      .pipe(switchMap(() => {
        return this.getExpenses();
      }))
  }

  updateExpense(expense: Expense): Observable<any> {
    return this.http.put<{ expenseId: string }>(`${environment.URL}:${environment.expense_port}/expense/update/${expense.id}`, expense, { headers: this.headers });
  }

  getExpenses(): Observable<Expense[]> {
    return this.http.get<{ expenses: Expense[] }>(`${environment.URL}:${environment.expense_port}/expense`, { headers: this.headers })
      .pipe(map(({ expenses }) => {
        this.monthlyExpense = this.util.calculateTotalAmount(expenses);
        this.monthlyExpenseEvent.next(this.monthlyExpense);
        return expenses;
      }));
  }

}