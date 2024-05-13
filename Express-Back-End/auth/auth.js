'use strict';

const express = require('express');
const app = express();
require('dotenv').config();

const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');


const { login, register } = require('./auth.service');

const corsOptions = {
  origin: 'http://localhost:4200',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200
}

/**Middlewares */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors(corsOptions));

app.post('/login', login)

app.post('/register', register)

app.listen(process.env.AUTH_PORT, () => {
  console.log('Auth running on port', process.env.AUTH_PORT);
})


