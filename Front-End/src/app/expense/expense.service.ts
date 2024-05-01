import { Injectable } from '@angular/core';
import { Observable, Subject, map, switchMap } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";

import { Expense } from './expense.model';
import { UtilService } from '../shared/util.service';
import { environment } from '../../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private expenseList: Expense[] = [
    {
      id: '1',
      to: 'John',
      date: '20-4-2024',
      amount: 10000,
      description: 'Delivery'
    },
    {
      id: '2',
      to: 'Hie',
      date: '6-4-2024',
      amount: 10000,
      description: 'Furniture'
    },
    {
      id: '3',
      to: 'Mayur',
      date: '10-4-2024',
      amount: 10000,
      description: 'Laundry'
    },
    {
      id: '4',
      to: 'Alex',
      date: '23-4-2024',
      amount: 10000,
      description: 'Food'
    }
  ]
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  })
  public monthlyExpense: number = 0;
  public expenseEvent: Subject<Expense[]> = new Subject<Expense[]>();
  public expenseEditEvent: Subject<{ action: string, idx: number, payload?: Expense }> = new Subject<{ action: string, idx: number, payload?: Expense }>();

  constructor(
    private util: UtilService,
    private http: HttpClient
  ) { }

  addExpense(expense: Expense): Observable<Expense[]> {
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    return this.http.post<{ expenseId: string }>(`${environment.URL}:${environment.expense_port}/expense/add`, expense, { headers })
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
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    return this.http.put<{ expenseId: string }>(`${environment.URL}:${environment.expense_port}/expense/update/${expense.id}`, expense, { headers: this.headers });
  }

  getExpenses(): Observable<Expense[]> {
    return this.http.get<{ expenses: Expense[] }>(`${environment.URL}:${environment.expense_port}/expense`, { headers: this.headers })
      .pipe(map(({ expenses }) => {
        this.monthlyExpense = this.util.calculateTotalAmount(expenses);
        return expenses;
      }));
  }

}