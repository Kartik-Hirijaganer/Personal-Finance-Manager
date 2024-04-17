import { Injectable } from "@angular/core";

import { Income } from "./income.model";

@Injectable({ providedIn: 'root' })
export class IncomeService {
  public monthly_income: number = 0;
  private income_list: Income[] = [];
  private count: number = 0;

  constructor() { }

  addIncomeEntry(from: string, date: string, amount: number, description: string): void {
    const new_income_entry = {
      id: ++this.count,
      from, 
      date, 
      amount, 
      description
    }
    this.income_list.push(new_income_entry);
  }

  removeIncomeEntry(): void { }

  updateIncomeEntry(): void { }
}