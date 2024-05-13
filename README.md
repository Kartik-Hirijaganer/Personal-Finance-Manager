# Personal Finance Tracker
### Overview
#### Goal:
- The primary focus of the application is to empower users to effortlessly track and monitor their personal finances.
- The aim of the website is to help users keep track of their expenses, and overall financial activities.
#### Summary:
- Users have option to sign up, create profiles and add multiple accounts from various banks. A warning message prompts users to link accounts if none are present. 
- Each account allows users to monitor their monthly income, expenses, and liabilities such as rent. 
- The user dashboard displays account information, including current balance, income, expenses, and liabilities, along with a six-month cash flow chart. 
- Users can download the cash flow chart and delete their accounts or profile if needed.
### Technologies used
- Front-End
  - Angular
  - RxJS
  - Ag-grid
  - Ag-charts
  - Bootstrap 5
  - ngx-bootstrap
- Back-End
  - NodeJS
  - ExpressJS
  - JWT
  - MongoDB
  - Mongoose
  - Axios
  - Handlebars (For PDF)
### Setup
- Clone the repository and run npm install in both Front-End and Express-Back-End folder.
 ```
// Terminal 1

$ cd ../Front-End
$ npm install
$ ng serve

// Terminal 2

$ cd ../Express-Back-End
$ npm install
$ npm run auth
$ npm run user
$ npm run account
```
- In Express-Back-End folder create a **.env** file. The file should contain following variables:
  - CONNECTION_URL: This will be your monogodb database connection user
  - FRONT_END_URL: Your front-end your, where responses and errors will be sent.
  - SECRET: This secret will be used while create and verfiying jwt tokens.
  - ACCOUNT_PORT, USER_PORT, AUTH_PORT: If your running this application locally.
