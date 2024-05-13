import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from "@angular/common/http";

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

  constructor ( private util: UtilService, private http: HttpClient ) { }

  addExpense(expense: Expense): Observable<{ expenseId: string }> {
    return this.http.post<{ expenseId: string }>(
      `${environment.URL}:${environment.account_port}/expense/add`, 
      { ...expense, month: this.util.getMonthPayload(expense.date) },
      {
        params: { 'category': 'expense', 'accountId': localStorage.getItem('account_id') || '' }
      }
    );
  }

  deleteExpense(id: string): Observable<{ expenseId: string }> {
    return this.http.delete<{ expenseId: string }>(
      `${environment.URL}:${environment.account_port}/expense/delete/${id}`,
      {
        params: { 'category': 'expense', 'accountId': localStorage.getItem('account_id') || '' }
      });
  }

  updateExpense(expense: Expense): Observable<{ expenseId: string }> {
    return this.http.put<{ expenseId: string }>(
      `${environment.URL}:${environment.account_port}/expense/update/${expense.id}`, 
      { ...expense, month: this.util.getMonthPayload(expense.date) },
      {
        params: { 'category': 'expense', 'accountId': localStorage.getItem('account_id') || '' }
      });
  }
}