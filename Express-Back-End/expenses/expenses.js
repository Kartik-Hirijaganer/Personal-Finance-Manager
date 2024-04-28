/** Imports */
const express = require('express');
const app = express();
require('dotenv').config()

const bodyParser = require('body-parser');
const morgan = require('morgan');

const util = require('../shared/util');
const expenseController = require('./expense.service');

/** Middlewares */
app.use(bodyParser.json());
app.use(morgan('tiny'));
util.connectDB();

/** APIs */
app.get('/expense/:id', expenseController.getExpense);

app.post('/expense/add', expenseController.addNewExpense);

app.put('/expense/update/:id', expenseController.updateExpense);

app.delete('/expense/delete/:id', expenseController.deleteExpense);

app.listen(process.env.EXPENSE_PORT, () => {
  console.log('Expense running');
})