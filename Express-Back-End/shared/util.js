'use strict';

const { v4: uuidv4 } = require('uuid');
const Handlebars = require('handlebars');
const Puppeteer = require('puppeteer');

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

const generateID = (input) => {
  return (input + uuidv4().substring(0, 4)).toUpperCase();
}

const hbRegister = () => {
  Handlebars.registerHelper('symbolHelper', (value, symbol) => {
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
      return res.status(200).send({ errorMessage, error });
    }
    if (error instanceof BrowserLaunchError) {
      return res.status(200).send({ errorMessage, error });
    }
    const err = new GeneratePdfError(error.message);
    return res.status(200).send({ errorMessage, err });
  }
  return res.status(200).contentType('application/pdf').send(pdf);
}

module.exports = {
  connectDB,
  generateID,
  generatePdf
}