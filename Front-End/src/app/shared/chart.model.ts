export class Chart {
  public month: string;
  public expense: number;
  public income: number;
  public liability: number;
  constructor(month: string, expense: number, income: number, liability: number) {
    this.month = month;
    this.expense = expense;
    this.income = income;
    this.liability = liability;
  }
}