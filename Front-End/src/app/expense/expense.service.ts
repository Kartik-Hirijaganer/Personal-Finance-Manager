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
      `${environment.base_url}/${environment.version}/entries/add`, 
      { ...expense, month: this.util.getMonthPayload(expense.date) },
      {
        params: { method: 'add_entry', 'category': 'expense', 'accountId': localStorage.getItem('account_id') || '' }
      }
    );
  }

  deleteExpense(id: string): Observable<{ expenseId: string }> {
    return this.http.delete<{ expenseId: string }>(
      `${environment.base_url}/${environment.version}/entries/delete/${id}`,
      {
        params: { method: 'delete_entry', 'category': 'expense', 'accountId': localStorage.getItem('account_id') || '' }
      });
  }

  updateExpense(expense: Expense): Observable<{ expenseId: string }> {
    return this.http.put<{ expenseId: string }>(
      `${environment.base_url}/${environment.version}/entries/update/${expense.id}`, 
      { ...expense, month: this.util.getMonthPayload(expense.date) },
      {
        params: { method: 'update_entry', 'category': 'expense', 'accountId': localStorage.getItem('account_id') || '' }
      });
  }
}