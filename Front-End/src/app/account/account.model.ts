export class Account {
  public accountNo: number;
  public accountSource: string;
  public description: string;

  constructor (accountNo: number, accountSource: string, description: string) {
    this.accountNo = accountNo;
    this.accountSource = accountSource;
    this.description = description;
  }
}