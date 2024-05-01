export class Income {
  public id: string;
  public from: string;
  public date: string;
  public amount: number;
  public description: string

  constructor(id: string, from: string, date: string, amount: number, description: string) {
    this.id = id;
    this.from = from;
    this.date = date;
    this.amount = amount;
    this.description = description
  }
}