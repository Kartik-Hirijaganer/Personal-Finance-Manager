export class User {
  public id: string;
  public fname: string;
  public mname: string;
  public lname: string;
  public dob: string;
  public gender: string;
  public email: string;
  public phone: string;
  public profile_img?: string;
  public pass?: string;
  public accounts?: [ string ];
  public reminders?: [{
    name: string,
    date: string,
    frequency: string,
    note: string,
    message: string,
    severity: string
  }];

  constructor(
    id: string, 
    pass: string, 
    fname: string, 
    mname: string, 
    lname: string, 
    dob: string, 
    gender: string,
    email: string, 
    phone: string, 
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
    this.pass = pass;
    this.fname = fname;
    this.mname = mname;
    this.lname = lname;
    this.dob = dob;
    this.gender = gender;
    this.email = email;
    this.phone = phone;
    this.profile_img = profile_img;
    this.accounts = accounts;
    this.reminders = reminders;
  }
}