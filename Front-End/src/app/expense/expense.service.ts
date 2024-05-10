import { Injectable } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Expense } from './expense.model';
import { UtilService } from '../shared/util.service';
import { environment } from '../../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  public monthlyExpense: number = 0;
  public monthlyExpenseEvent: Subject<number> = new Subject<number>();
  public expenseEvent: Subject<Expense[]> = new Subject<Expense[]>();
  public expenseEditEvent: Subject<{ action: string, idx: number, payload?: Expense }> = new Subject<{ action: string, idx: number, payload?: Expense }>();

  constructor(
    private util: UtilService,
    private http: HttpClient
  ) { }

  addExpense(expense: Expense): Observable<{ expenseId: string }> {
    return this.http.post<{ expenseId: string }>(
      `${environment.URL}:${environment.expense_port}/expense/add`, 
      expense, 
      { 
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') || ''
        }),
        params: { 'category': 'expense', 'accountId': localStorage.getItem('account_id') || '' }
      }
    );
  }

  deleteExpense(id: string): Observable<{ expenseId: string }> {
    return this.http.delete<{ expenseId: string }>(
      `${environment.URL}:${environment.account_port}/expense/delete/${id}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') || ''
        }),
        params: { 'category': 'expense', 'accountId': localStorage.getItem('account_id') || '' }
      });
  }

  updateExpense(expense: Expense): Observable<{ expenseId: string }> {
    return this.http.put<{ expenseId: string }>(
      `${environment.URL}:${environment.expense_port}/expense/update/${expense.id}`, 
      expense, 
      { headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') || ''}),
        params: { 'category': 'expense', 'accountId': localStorage.getItem('account_id') || '' }
      });
  }

  getExpenses(): Observable<any> {
    return this.http.get<{ expenses: Expense[] }>(`${environment.URL}:${environment.expense_port}/expense`, { headers: {'Content-Type': 'application/json'} })
      .pipe(map(({ expenses }) => {
        this.monthlyExpense = this.util.calculateTotalAmount(expenses);
        this.monthlyExpenseEvent.next(this.monthlyExpense);
        return this.util.data;
      }));
  }

}