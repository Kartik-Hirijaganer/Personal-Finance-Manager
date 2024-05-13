import { Expense } from "../expense/expense.model";
import { Income } from "../income/income.model";
import { Liability } from "../liability/liability.model";

export class Account {
  public accountNo: number;
  public accountSource: string;
  public description: string;
  public incomes: Income[];
  public expenses: Expense[];
  public liabilities: Liability[];

  constructor (accountNo: number, accountSource: string, description: string, incomes: Income[], expenses: Expense[], liabilities: Liability[]) {
    this.accountNo = accountNo;
    this.accountSource = accountSource;
    this.description = description;
    this.incomes = incomes;
    this.expenses = expenses;
    this.liabilities = liabilities;
  }
}