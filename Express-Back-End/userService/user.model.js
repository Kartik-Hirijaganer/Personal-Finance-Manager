const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    unique: true
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
  email: {
    type: String,
    required: true,
    unique: true
  },
  mobile: {
    type: String,
    required: true,
    unique: true
  },
  profile_img: {
    type: String
  },
  accounts: {
    type: [String]
  },
  reminders: {
    type: [{
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
    }]
  }
});

const User = mongoose.model('user', UserSchema);
module.exports = User;