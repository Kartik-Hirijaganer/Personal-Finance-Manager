import { Injectable } from '@angular/core';

import { Liability } from '../liability/liability.model';
import { Expense } from '../expense/expense.model';
import { Income } from '../income/income.model';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  toggle(state: boolean): boolean {
    return !state;
  }

  currencyFormatter(currency: number, sign: string) {
    const amount = currency.toFixed(0);
    const formatted = amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return sign + `${formatted}`;
  }

  calculateMonthlyTotal(list: Liability[] | Income[] | Expense[]): number {
    console.log('list',list);
    
    let total: number = 0;
    for (const entry of list) {
      if (entry?.amount) {
        total += entry.amount;
      }
    }
    return total;
  }
}