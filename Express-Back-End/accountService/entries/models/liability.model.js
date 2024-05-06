const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LiabilitySchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
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
  }
})

const Liability = mongoose.model('liabilitie', LiabilitySchema);
module.exports = Liability;