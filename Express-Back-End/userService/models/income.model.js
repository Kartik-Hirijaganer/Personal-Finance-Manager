const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IncomeSchema = new Schema({
  id: {
    type: String,
    required: true
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

module.exports = IncomeSchema;
