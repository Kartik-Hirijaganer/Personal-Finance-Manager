'use strict';

const winston = require('winston');
const { combine, timestamp, json } = winston.format;

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

const logger = winston.createLogger({
  level: 'info',
  format: combine(errors({ stack: true }), timestamp(), json()),
  transports: [new winston.transports.Console()],
});

const generateResponse = (statusCode, message, responseBody) => {
  logger.log({ level: 'info', message, response: JSON.stringify(responseBody) });
  return {
    statusCode,
    body: { message, response: JSON.stringify(responseBody) }
  }
}

module.exports = {
  connectDB,
  logger,
  generateResponse
}