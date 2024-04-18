import { Injectable } from "@angular/core";

import { Income } from "./income.model";

@Injectable({ providedIn: 'root' })
export class IncomeService {
  private _count: number = 0;
  public monthly_income: number = 0;
  private income_list: Income[] = [
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

  constructor() { }

  addIncomeEntry(from: string, date: string, amount: number, description: string): void {
    const new_income_entry: Income = {
      payment_id: ++this._count,
      from, 
      date, 
      amount,
      description
    }
    this.income_list.push(new_income_entry);
  }

  removeIncomeEntry(): void { }

  updateIncomeEntry(): void { }

  getIncomeList(): Income[] {
    return this.income_list.splice(this.income_list.length);
  }
}