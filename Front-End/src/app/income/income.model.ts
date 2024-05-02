export class Income {
  public id: string;
  public from: string;
  public date: string;
  public amount: number;
  public description: string;
  public month: { type: string, name: string, id: number };

  constructor(id: string, from: string, date: string, amount: number, description: string,
    month: { type: string, name: string, id: number }) {
    this.id = id;
    this.from = from;
    this.date = date;
    this.amount = amount;
    this.description = description;
    this.month = month;
  }
}