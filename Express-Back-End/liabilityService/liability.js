const express = require('express');
const app = express();
require('dotenv').config()

const bodyParser = require('body-parser');
const morgan = require('morgan');

const util = require('../shared/util');
const liabilityService = require('./liability.service');

/** Middlewares */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));

util.connectDB();

/** APIs */
app.get('/liability/:id', liabilityService.getLiability);

app.post('/liability/add', liabilityService.addNewLiability);

app.put('/liability/update/:id', liabilityService.updateLiability);

app.delete('/liability/delete/:id', liabilityService.deleteLiability);

app.listen(process.env.LIABILITY_PORT, () => {
  console.log('Liability running on port', process.env.LIABILITY_PORT);
})