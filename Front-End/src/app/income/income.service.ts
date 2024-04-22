import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { Income } from "./income.model";

@Injectable({ providedIn: 'root' })
export class IncomeService {
  public monthly_income: number = 0;
  private _income_list: Income[] = [
    {
      payment_id: 1,
      from: 'Alex',
      date: "4-14-2024",
      amount: 10000,
      description: 'Food'
    },
    {
      payment_id: 2,
      from: 'Carl',
      date: "4-16-2024",
      amount: 150000,
      description: 'Oil'
    },
    {
      payment_id: 3,
      from: 'Rute',
      date: "5-14-2024",
      amount: 20000,
      description: 'Delivery'
    }
  ];
  public incomeListEvent: Subject<Income[]> = new Subject<Income[]>();

  constructor() { }

  addIncomeEntry(from: string, date: string, amount: number, description: string): void {
    const new_income_entry: Income = {
      payment_id: this._income_list[this._income_list.length - 1]?.payment_id + 1,
      from, 
      date, 
      amount,
      description
    }
    this._income_list.push(new_income_entry);
    this.monthly_income += amount;
    this.incomeListEvent.next(this._income_list.slice(0));
  }

  deleteIncomeEntry(payment_id: number, data: Income): void { 
    const idx: number = this._income_list.findIndex( entry => entry.payment_id === payment_id);
    this.monthly_income -= this._income_list[idx]?.amount || 0;
    this._income_list.splice(idx, 1);
    this.incomeListEvent.next(this._income_list.slice(0));
  }

  updateIncomeEntry(): void { }

  getIncomeList(): Income[] {
    return this._income_list.slice(0);
  }
}