import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { Income } from "./income.model";
import { UtilService } from "../shared/util.service";

@Injectable({ providedIn: 'root' })
export class IncomeService {
  public monthly_income: number = 0;
  private incomeList: Income[] = [
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
  public incomeEditEvent: Subject<{ action: string, idx: number, payload?: Income }> = new Subject<{ action: string, idx: number, payload?: Income }>();

  constructor( private util: UtilService ) { }

  addIncome(from: string, date: string, amount: number, description: string): void {
    const new_income_entry: Income = {
      id: this.incomeList[this.incomeList.length - 1]?.id + 1,
      from,
      date,
      amount,
      description
    }
    this.incomeList.push(new_income_entry);
    this.monthly_income += amount;
    this.incomeListEvent.next(this.incomeList.slice(0));
  }

  deleteIncome(id: number): void {
    const idx: number = this.incomeList.findIndex(income => income?.id === id);
    this.monthly_income -= this.incomeList[idx]?.amount || 0;
    this.incomeList.splice(idx, 1);
    this.incomeListEvent.next(this.incomeList.slice(0));
  }

  updateIncome(income: Income): void {
    const idx: number = this.incomeList.findIndex(entry => entry?.id === income?.id);
    this.incomeList.splice(idx, 1, income);
    this.incomeListEvent.next(this.incomeList.slice(0));
    this.monthly_income = this.util.calculateMonthlyTotal(this.incomeList);
  }

  getIncomeList(): Income[] {
    return this.incomeList.slice(0);
  }
}