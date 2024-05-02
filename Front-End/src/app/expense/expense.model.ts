export class Expense {
  public id: string;
  public to: string;
  public date: string;
  public amount: number;
  public description: string;
  public month: { type: string, name: string, id: number }

  constructor(
    id: string,
    to: string,
    date: string,
    amount: number,
    description: string,
    month: { type: string, name: string, id: number }
  ) {
    this.id = id;
    this.to = to;
    this.date = date;
    this.amount = amount;
    this.description = description;
    this.month = month;
  }
}