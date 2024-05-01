const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IncomeSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  from: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String
  }
});

const Income = mongoose.model('income', IncomeSchema)
module.exports = Income;
