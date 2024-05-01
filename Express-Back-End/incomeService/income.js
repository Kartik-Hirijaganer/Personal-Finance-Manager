const express = require('express');
const app = express();
require('dotenv').config();

const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const util = require('../shared/util');
const incomeService = require('./income.service');

const corsOptions = {
  origin: 'http://localhost:4200',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200
}

/** Middleware */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors(corsOptions));

util.connectDB();

/** APIs */
app.get('/income', incomeService.getIncome);

app.post('/income/add', incomeService.addNewIncome);

app.put('/income/update/:id', incomeService.updateIncome);

app.delete('/income/delete/:id', incomeService.deleteIncome);

app.listen(process.env.INCOME_PORT, () => {
  console.log('Income running on port', process.env.INCOME_PORT);
})