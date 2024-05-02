export class Liability {
  public id: string;
  public name: string;
  public amount: number;
  public due_date: string;
  public description: string;
  public month: { type: string, name: string, id: number };

  constructor(id: string, name: string, amount: number, description: string, due_date: string,
    month: { type: string, name: string, id: number }
  ) {
    this.id = id;
    this.name = name;
    this.amount = amount;
    this.due_date = due_date;
    this.description = description;
    this.month = month;
  }
}