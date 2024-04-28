'use strict';

const { v4: uuidv4 } = require('uuid');

const mongoose = require('mongoose');
require('dotenv').config()

const options = Object.freeze()

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_URL, options);
  } catch (error) {
    console.log(error);
  }
  console.log('connected to DB');
}

const generateID = () => {
  return uuidv4();
}

module.exports = {
  connectDB,
  generateID
}