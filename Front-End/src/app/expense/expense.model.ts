export class Expense {
  public id: string;
  public to: string;
  public date: string;
  public amount: number;
  public description: string;
  public month: { name: string, monthId: number }

  constructor(
    id: string,
    to: string,
    date: string,
    amount: number,
    description: string,
    month: { name: string, monthId: number }
  ) {
    this.id = id;
    this.to = to;
    this.date = date;
    this.amount = amount;
    this.description = description;
    this.month = month;
  }
}