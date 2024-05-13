# Personal Finance Tracker
### Overview
#### Goal:
- The primary focus of the application is to empower users to effortlessly track and monitor their finances.
- The website aims to help users keep track of their expenses and overall financial activities.
#### Summary:
- Users have the option to sign up, create profiles, and add multiple accounts from various banks. A warning message prompts users to link accounts if none are present. 
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
### Screenshots
- Login
  ![login](https://github.com/Kartik-Hirijaganer/Personal-Finance-Manager/assets/65550498/c6b9cc5b-d052-4781-8eba-5816c91ab70a)
  
- Registration
  ![registeration](https://github.com/Kartik-Hirijaganer/Personal-Finance-Manager/assets/65550498/3a51445c-9a18-4986-b2c8-58e08bee0f7f)
  
- User Profile
  ![user](https://github.com/Kartik-Hirijaganer/Personal-Finance-Manager/assets/65550498/1fa007e3-b4a3-439c-8388-5727803f8086)
  
- Forgot password
  ![forgot_password](https://github.com/Kartik-Hirijaganer/Personal-Finance-Manager/assets/65550498/2b84d014-b031-42bf-a385-16a24f9eaf1d)
  
- Dashboard without a linked account
  ![dashboard_no_account](https://github.com/Kartik-Hirijaganer/Personal-Finance-Manager/assets/65550498/ca1e75cc-f9b3-4547-bc9b-19247a2b1454)
  
- Dashboard
  ![Dashboard](https://github.com/Kartik-Hirijaganer/Personal-Finance-Manager/assets/65550498/6d6aa8d5-6a7c-4986-bdd4-401d5190df4e)
  
- Incomes
  ![income](https://github.com/Kartik-Hirijaganer/Personal-Finance-Manager/assets/65550498/73fbab95-6d65-4031-88fc-ae4050a6df27)
  
- Expenses
  ![expense](https://github.com/Kartik-Hirijaganer/Personal-Finance-Manager/assets/65550498/929bd0ed-a280-4ed1-b1bd-debdbd0e4050)
  
- Liabilities
  ![liabilities](https://github.com/Kartik-Hirijaganer/Personal-Finance-Manager/assets/65550498/3c015e28-2973-44d5-a7d1-6a2760306613)
  
- Accounts
  ![accounts](https://github.com/Kartik-Hirijaganer/Personal-Finance-Manager/assets/65550498/60702586-294f-4b54-a77f-cc516662b920)
  
- Cash flow pdf
  ![Six-Months-Cash-Flow-Pdf](https://github.com/Kartik-Hirijaganer/Personal-Finance-Manager/assets/65550498/0156e6fc-206e-4c62-b44e-bbb99c45dffa)

### Setup
- Clone the repository and run npm install in both the Front-End and Express-Back-End folder.
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
- In Express-Back-End folder create a **.env** file. The file should contain the following variables:
  - CONNECTION_URL: This will be your MongoDB database connection user
  - FRONT_END_URL: Your front-end, where responses and errors will be sent.
  - SECRET: This secret will be used while creating and verifying JWT tokens.
  - ACCOUNT_PORT, USER_PORT, AUTH_PORT: If you're running this application locally.
