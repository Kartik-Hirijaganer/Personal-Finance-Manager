const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IncomeSchema = require('./income.model');
const ExpenseSchema = require('./expense.model');
const LiabilitySchema = require('./liability.model');

const AccountSchema = new Schema({
  accountId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true
  },
  accountNo: {
    type: Number,
    required: true
  },
  accountSource: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  incomes: {
    type: [IncomeSchema]
  },
  expenses: {
    type: [ExpenseSchema]
  },
  liabilities: {
    type: [LiabilitySchema]
  }
});

const Account = mongoose.model('account', AccountSchema)
module.exports = Account;
