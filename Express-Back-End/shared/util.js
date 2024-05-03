'use strict';

const { v4: uuidv4 } = require('uuid');
const Handlebars = require('handlebars');
const Puppeteer = require('puppeteer');

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

const compileHtmlToPdf = async (htmlTemplate, payload) => {
  try {
    return Handlebars.compile(htmlTemplate)(payload);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const generateHtmlToPdf = async (template, header, footer) => {
  try {
    const browser = await Puppeteer.launch({
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
    });
    const page = await browser.newPage();
    await page.setContent(template, { waitUntil: 'domcontentloaded' });
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: true,
      footerTemplate: '<div>Footer</div>'
    });
    return pdf;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const generatePdf = async (req, res) => {
  const { data, payload } = req.body;
  const { cash_flow } = data;
  try {
    const compiledTemplate = await compileHtmlToPdf(cash_flow.metaData, payload);
    const pdf = await generateHtmlToPdf(compiledTemplate, cash_flow.header, cash_flow.footer);
    res.status(200).contentType('application/pdf').send(pdf);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = {
  connectDB,
  generateID,
  generatePdf
}