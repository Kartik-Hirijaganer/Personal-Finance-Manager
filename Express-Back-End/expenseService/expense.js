/** Imports */
const express = require('express');
const app = express();
require('dotenv').config()

const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const util = require('../shared/util');
const expenseService = require('./expense.service');

const corsOptions = {
  origin: 'http://localhost:4200',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200
}

/** Middlewares */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors(corsOptions));

util.connectDB();

/** APIs */
app.get('/expense', expenseService.getExpense);

app.post('/expense/add', expenseService.addNewExpense);

app.put('/expense/update/:id', expenseService.updateExpense);

app.delete('/expense/delete/:id', expenseService.deleteExpense);

app.listen(process.env.EXPENSE_PORT, () => {
  console.log('Expense running on port', process.env.EXPENSE_PORT);
})