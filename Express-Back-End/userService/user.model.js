const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  fname: {
    type: String,
    required: true
  },
  mname: {
    type: String
  },
  lname: {
    type: String,
    required: true
  },
  dob: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  profile_img: {
    type: String
  },
  accounts: {
    type: [String]
  }
  // reminders: {
  //   type: [ReminderSchema]
  // }
});

const User = mongoose.model('user', UserSchema);
module.exports = User;