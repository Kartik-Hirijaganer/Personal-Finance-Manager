import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';

import { ExpenseService } from "../expense/expense.service";
import { IncomeService } from "../income/income.service";
import { LiabilityService } from "../liability/liability.service";

import { Expense } from '../expense/expense.model';
import { Income } from '../income/income.model';
import { Liability } from '../liability/liability.model';
import { Chart } from '../shared/chart.model';
import { UtilService } from '../shared/util.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    public expenseService: ExpenseService,
    public incomeService: IncomeService,
    public liabilityService: LiabilityService,
    private util: UtilService
  ) { }

  filterCashflowData(data: Expense[] | Income[] | Liability[]): Expense[] | Income[] | Liability[] {
    const currMonthIdx: number = new Date().getMonth() + 1;
    const isFirstHalf = currMonthIdx <= 6;
    if (isFirstHalf) {
      return data?.filter(el => el?.month?.monthId <= 6) as Expense[] | Income[] | Liability[];
    } else {
      return data?.filter(el => el?.month?.monthId >= 6) as Expense[] | Income[] | Liability[];
    }
  }

  constructChartData(incomes: Income[], expenses: Expense[], liabilities: Liability[]): Chart[] {
    const sixMonthIncomes = this.filterCashflowData(incomes);
    const sixMonthExpenses = this.filterCashflowData(expenses);
    const sixMonthLiabilities = this.filterCashflowData(liabilities);
    const month = new Date().getMonth();

    const chartData: Chart[] = [];
    for (let i = 0; i < 6; i++) {
      const monthData: Chart = {
        month: sixMonthExpenses[i]?.month.name || this.util.monthNames[month + i],
        income: sixMonthIncomes[i]?.amount || 0,
        expense: sixMonthExpenses[i]?.amount || 0,
        liability: sixMonthLiabilities[i]?.amount || 0
      }
      chartData.push(monthData);
    }
    return chartData;
  }

  get user() {
    return { userName: localStorage.getItem('user_name'), profile_img: localStorage.getItem('profile_img') };
  }

  calculateMonthlyTotal(entries: Income[] | Expense[] | Liability[]): number {
    return entries?.reduce((xs: number, x: Income | Expense | Liability) => {
      xs += x.amount;
      return xs;
    }, 0)
  }

  userLoggedIn() {
    return !!localStorage.getItem('user_id');
  }
}