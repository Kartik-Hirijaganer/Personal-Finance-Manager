const express = require('express');
const app = express();
require('dotenv').config()

const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const util = require('../shared/util');
const liabilityService = require('./liability.service');

const corsOptions = {
  origin: 'http://localhost:4200',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200
}

/** Middlewares */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors(corsOptions))

util.connectDB();

/** APIs */
app.get('/liability', liabilityService.getLiability);

app.post('/liability/add', liabilityService.addNewLiability);

app.put('/liability/update/:id', liabilityService.updateLiability);

app.delete('/liability/delete/:id', liabilityService.deleteLiability);

app.listen(process.env.LIABILITY_PORT, () => {
  console.log('Liability running on port', process.env.LIABILITY_PORT);
})