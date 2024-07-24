'use strict';
const winston = require('winston');
const { combine, timestamp, json, errors } = winston.format;

const logger = winston.createLogger({
  level: 'info',
  format: combine(errors({ stack: true }), timestamp(), json()),
  transports: [new winston.transports.Console()],
});

const generateResponse = (statusCode, message, responseBody) => {
  const response = {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
      "Access-Control-Allow-Methods": "POST,OPTIONS"
    },
    body: JSON.stringify({ message, response: responseBody })
  }
  const level = statusCode >= 200 && statusCode <= 399 ? 'info' : 'error';
  logger.log({ level, message, response });
  return response;
}

module.exports = {
  logger,
  generateResponse
}