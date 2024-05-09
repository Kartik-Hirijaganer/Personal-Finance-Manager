import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';

import { ExpenseService } from "../expense/expense.service";
import { IncomeService } from "../income/income.service";
import { LiabilityService } from "../liability/liability.service";

import { Expense } from '../expense/expense.model';
import { Income } from '../income/income.model';
import { Liability } from '../liability/liability.model';
import { Chart } from '../shared/chart.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    public expenseService: ExpenseService,
    public incomeService: IncomeService,
    public liabilityService: LiabilityService
  ) { }

  filterCashflowData(data: Expense[] | Income[] | Liability[]): Expense[] | Income[] | Liability[] {
    const currMonthIdx: number = new Date().getMonth() + 1;
    const isFirstHalf = currMonthIdx <= 6;
    if (isFirstHalf) {
      return data?.filter(el => el?.month?.id <= 6) as Expense[] | Income[] | Liability[];
    } else {
      return data?.filter(el => el?.month?.id >= 6) as Expense[] | Income[] | Liability[];
    }
  }

  constructChartData(incomes: Income[], expenses: Expense[], liabilities: Liability[]): Chart[] {
    const sixMonthExpenses = this.filterCashflowData(expenses);
    const sixMonthIncomes = this.filterCashflowData(incomes);
    const sixMonthLiabilities = this.filterCashflowData(liabilities);

    const chartData: Chart[] = [];
    for (let i = 0; i < 6; i++) {
      const monthData: Chart = {
        month: sixMonthExpenses[i]?.month.name,
        income: sixMonthIncomes[i]?.amount,
        expense: sixMonthExpenses[i]?.amount,
        liability: sixMonthLiabilities[i]?.amount
      }
      chartData.push(monthData);
    }
    return chartData;
  }

  getChartData(): Observable<{incomes: Income[], expenses: Expense[], liabilities: Liability[]}> {
    return forkJoin({
      incomes: this.incomeService.getIncomes(),
      expenses: this.expenseService.getExpenses(),
      liabilities: this.liabilityService.getLiabilities()
    });
  }

  get user() {
    return { userName: localStorage.getItem('user_name'), profile_img: localStorage.getItem('profile_img') };
  }

  userLoggedIn() {
    return !!localStorage.getItem('user_id');
  }
}