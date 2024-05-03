const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReminderSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    default: 'daily'
  },
  note: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  severity: {
    type: String,
    default: 'med'
  }
});

module.exports = { ReminderSchema };