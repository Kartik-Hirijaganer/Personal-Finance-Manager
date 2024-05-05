'use strict';

const express = require('express');
const app = express();
require('dotenv').config();

const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const { authorize } = require('../auth/auth.service');

const util = require('../shared/util');
const userService = require('./user.service');

const corsOptions = {
  origin: 'http://localhost:4200',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200
}

/** Middlewares */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '2mb' }));
app.use(morgan('tiny'));
app.use(cors(corsOptions));

util.connectDB();

/** APIs */
app.get('/user/:userId', userService.getUser);

app.post('/user/add', userService.addNewUser);

app.use(authorize);

app.post('/user/generate-pdf', util.generatePdf);

app.put('/user/update/:id', userService.updateUser);

app.delete('/user/delete/:id', userService.deleteUser);

app.listen(process.env.USER_PORT, () => {
  console.log('User running on port', process.env.USER_PORT);
})