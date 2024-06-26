const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExpenseSchema = new Schema({
  id: {
    type: String,
    required: true
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
  },
  month: {
    name: {
      type: String,
      required: true
    },
    monthId: {
      type: Number,
      required: true
    }
  }
});

module.exports = ExpenseSchema;