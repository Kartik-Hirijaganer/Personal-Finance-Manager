const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LiabilitySchema = new Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  due_date: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
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
})

module.exports = LiabilitySchema;