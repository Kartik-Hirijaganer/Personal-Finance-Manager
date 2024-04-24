export class Liability {
  public id: number;
  public name: string;
  public amount: number;
  public due_date: string;
  public description: string;

  constructor(id: number, name: string, amount: number, description: string, due_date: string) {
    this.id = id;
    this.name = name;
    this.amount = amount;
    this.due_date = due_date;
    this.description = description;
  }
}