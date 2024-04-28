const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.ObjectId;

const ExpenseSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  to: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'not a positive number']
  },
  description: {
    type: String,
    required: false
  }
});

const Expense = mongoose.model('expense', ExpenseSchema);
module.exports = Expense;