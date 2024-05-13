export class Income {
  public id: string;
  public from: string;
  public date: string;
  public amount: number;
  public description: string;
  public month: { name: string, monthId: number };

  constructor(id: string, from: string, date: string, amount: number, description: string,
    month: { name: string, monthId: number }) {
    this.id = id;
    this.from = from;
    this.date = date;
    this.amount = amount;
    this.description = description;
    this.month = month;
  }
}