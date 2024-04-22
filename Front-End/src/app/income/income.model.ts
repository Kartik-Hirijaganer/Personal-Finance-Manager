export class Income {
  public payment_id: number;
  public from: string;
  public date: string;
  public amount: number;
  public description: string

  constructor(payment_id: number, from: string, date: string, amount: number, description: string) {
    this.payment_id = payment_id;
    this.from = from;
    this.date = date;
    this.amount = amount;
    this.description = description
  }
}