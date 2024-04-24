export class Expense {
  public id: number;
  public to: string;
  public date: string;
  public amount: number;
  public description: string;

  constructor (id: number, to: string, date: string, amount: number, description: string) {
    this.id = id;
    this.to = to;
    this.date = date;
    this.amount = amount;
    this.description = description;
  }
}