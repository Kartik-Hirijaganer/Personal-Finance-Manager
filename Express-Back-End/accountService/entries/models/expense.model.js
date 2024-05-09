const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

module.exports = ExpenseSchema;