export class User {
  public id: string;
  public password: string;
  public fname: string;
  public mname: string;
  public lname: string;
  public dob: string;
  public email: string;
  public mobile: string;
  public profile_img: string;
  public accounts: [ string ];
  public reminders: [{
    name: string,
    date: string,
    frequency: string,
    note: string,
    message: string,
    severity: string
  }];

  constructor(
    id: string, 
    password: string, 
    fname: string, 
    mname: string, 
    lname: string, 
    dob: string, 
    email: string, 
    mobile: string, 
    profile_img: string, 
    accounts: [ string ], 
    reminders: [{
      name: string,
      date: string,
      frequency: string,
      note: string,
      message: string,
      severity: string
    }]
  ) {
    this.id = id;
    this.password = password;
    this.fname = fname;
    this.mname = mname;
    this.lname = lname;
    this.dob = dob;
    this.email = email;
    this.mobile = mobile;
    this.profile_img = profile_img;
    this.accounts = accounts;
    this.reminders = reminders;
  }
}