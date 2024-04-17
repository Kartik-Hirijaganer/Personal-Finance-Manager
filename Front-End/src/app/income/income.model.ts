export class Income {
  public id: number;
  public from: string;
  public date: string;
  public amount: number;
  public description: string;

  constructor(id: number, from: string, date: string, amount: number, description: string) {
    this.id = id;
    this.from = from;
    this.date = date;
    this.amount = amount;
    this.description = description;
  }
}