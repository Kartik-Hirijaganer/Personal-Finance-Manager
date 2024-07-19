'use strict';

const Handlebars = require('handlebars');
const Puppeteer = require('puppeteer');
const winston = require('winston');
const { combine, timestamp, json } = winston.format;

const { GeneratePdfError, HandlebarCompileError, BrowserLaunchError } = require('./errors');

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

const hbRegister = () => {
  Handlebars.registerHelper('symbolHelper', (value, symbol) => {
    if (value === '') {
      return value;
    }
    return `${symbol}${value}`
  });
  Handlebars.registerHelper('seperator', (value) => {
    if (!value) {
      return value
    }
    const strValue = value.toString();
    const n = strValue.length;
    if (n <= 3) {
      return strValue;
    }
    let reverse = strValue.split('').reverse();
    for (let i = 1; i < n; i++) {
      if (i % 3 === 0) {
        reverse.splice(i, 0, ',');
      }
    }
    return reverse.reverse().join('');
  });
}

const hbCompiler = async (htmlTemplate, payload) => {
  hbRegister();
  try {
    return Handlebars.compile(htmlTemplate)(payload);
  } catch (error) {
    throw new HandlebarCompileError(error.message);
  }
}

const launchBrowser = async (options) => {
  try {
    const browser = await Puppeteer.launch(options);
    return browser;
  } catch (error) {
    throw new BrowserLaunchError(error.message);
  }
}

const generatePdf = async (req, res) => {
  const { data, payload } = req.body;
  const { cash_flow } = data;

  let pdf = {};
  const browserOptions = {
    headless: true,
    ignoreDefaultArgs: ["--disable-extensions"],
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--hide-scrollbars",
      "--disable-gpu",
      "--mute-audio",
      "--disable-dev-shm-usage"
    ],
  }
  const pdfOptions = {
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    footerTemplate: '<div>Footer</div>'
  }
  try {
    const hbCompiledTemplate = await hbCompiler(cash_flow.metaData, payload);
    const browser = await launchBrowser(browserOptions);
    const page = await browser.newPage();
    await page.setContent(hbCompiledTemplate, { waitUntil: 'domcontentloaded' });
    pdf = await page.pdf(pdfOptions);
  } catch (error) {
    const errorMessage = 'Failed to generate pdf';
    if (error instanceof HandlebarCompileError) {
      return res(200, errorMessage, { errorMessage, error });
    }
    if (error instanceof BrowserLaunchError) {
      return res(200, errorMessage, { errorMessage, error });
    }
    const err = new GeneratePdfError(error.message);
    return res(200, errorMessage, { errorMessage, err });
  }
  return res(200, 'Successfully generated pdf', pdf);
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
  generatePdf,
  logger,
  generateResponse
}