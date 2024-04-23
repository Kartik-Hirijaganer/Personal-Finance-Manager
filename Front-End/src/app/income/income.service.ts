import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { Income } from "./income.model";

@Injectable({ providedIn: 'root' })
export class IncomeService {
  public monthly_income: number = 0;
  private _income_list: Income[] = [
    {
      id: 1,
      from: 'Alex',
      date: "4-14-2024",
      amount: 10000,
      description: 'Food'
    },
    {
      id: 2,
      from: 'Carl',
      date: "4-16-2024",
      amount: 10000,
      description: 'Oil'
    },
    {
      id: 3,
      from: 'Rute',
      date: "5-14-2024",
      amount: 10000,
      description: 'Delivery'
    }
  ];
  public incomeListEvent: Subject<Income[]> = new Subject<Income[]>();

  constructor() { }

  addIncomeEntry(from: string, date: string, amount: number, description: string): void {
    const new_income_entry: Income = {
      id: this._income_list[this._income_list.length - 1]?.id + 1,
      from,
      date,
      amount,
      description
    }
    this._income_list.push(new_income_entry);
    this.monthly_income += amount;
    this.incomeListEvent.next(this._income_list.slice(0));
  }

  deleteIncomeEntry(id: number, data: Income): void {
    const idx: number = this._income_list.findIndex(entry => entry.id === id);
    this.monthly_income -= this._income_list[idx]?.amount || 0;
    this._income_list.splice(idx, 1);
    this.incomeListEvent.next(this._income_list.slice(0));
  }

  updateIncomeEntry(payload: any): void {
    const idx: number = this._income_list.findIndex(entry => entry?.id === payload?.id);
    this._income_list.splice(idx, 1, payload);
    this.incomeListEvent.next(this._income_list.slice(0));
    this.monthly_income = this.calculateMonthlyIncome(this._income_list);
  }

  getIncomeList(): Income[] {
    return this._income_list.slice(0);
  }

  calculateMonthlyIncome(incomeList: Income[]): number {
    let monthlyIncome: number = 0;
    for (const income of incomeList) {
      monthlyIncome += income && income?.amount;
    }
    return monthlyIncome;
  }
}