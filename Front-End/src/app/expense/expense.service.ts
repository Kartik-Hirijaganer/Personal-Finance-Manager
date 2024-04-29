import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Expense } from './expense.model';
import { UtilService } from '../shared/util.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private expenseList: Expense[] = [
    {
      id: 1,
      to: 'John',
      date: '20-4-2024',
      amount: 10000,
      description: 'Delivery'
    },
    {
      id: 2,
      to: 'Hie',
      date: '6-4-2024',
      amount: 10000,
      description: 'Furniture'
    },
    {
      id: 3,
      to: 'Mayur',
      date: '10-4-2024',
      amount: 10000,
      description: 'Laundry'
    },
    {
      id: 4,
      to: 'Alex',
      date: '23-4-2024',
      amount: 10000,
      description: 'Food'
    }
  ]
  public monthlyExpense: number = 0;
  public expenseEvent: Subject<Expense[]> = new Subject<Expense[]>();
  public expenseEditEvent: Subject<{ action: string, idx: number, payload?: Expense }> = new Subject<{ action: string, idx: number, payload?: Expense }>();

  constructor ( private util: UtilService ) {}

  addExpense(expense: Expense): void {
    const id: number = (this.expenseList[this.expenseList.length - 1]?.id || 0) + 1;
    expense.id = id;
    this.expenseList.push(expense);
    this.monthlyExpense += expense?.amount;
    this.expenseEvent.next(this.expenseList.slice(0));
  }

  deleteExpense(id: number): void {
    const idx: number = this.expenseList.findIndex(expense => expense?.id === id);
    this.monthlyExpense -= this.expenseList[idx]?.amount || 0;
    this.expenseList.splice(idx, 1);
    this.expenseEvent.next(this.expenseList.slice(0));
  }

  updateExpense(expense: Expense): void {
    const id: number = expense.id;
    const idx: number = this.expenseList.findIndex(expense => expense?.id === id);
    this.expenseList.splice(idx, 1, expense);
    this.expenseEvent.next(this.expenseList.slice(0));
    this.monthlyExpense = this.util.calculateMonthlyTotal(this.expenseList);
  }

  get expenses(): Expense[] {
    return this.expenseList.slice(0);
  }

}