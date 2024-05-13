const express = require('express');
const app = express();
require('dotenv').config();

const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const util = require('../shared/util');
const { getAccount, getAccounts, addAccount, deleteAccount, deleteAccounts } = require('./account.service');
const { authorize } = require('../auth/auth.service');

const income = require('./entries/routes/income.routes');
const expense = require('./entries/routes/expense.routes');
const liability = require('./entries/routes/liability.routes');

const corsOptions = {
  origin: process.env.FRONT_END_URL,
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200
}
util.connectDB();

/** Middlewares */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors(corsOptions));
app.use(authorize);

/** routes */
app.use('/income', income);
app.use('/expense', expense);
app.use('/liability', liability);

/** APIs */
app.get('/accounts', getAccounts);
app.get('/account/:accountId', getAccount);

app.post('/account/add', addAccount);

app.delete('/account/delete/:accountId', deleteAccount);
app.delete('/accounts/delete', deleteAccounts);

app.listen(process.env.ACCOUNT_PORT, () => {
  console.log('Account server running on port', process.env.ACCOUNT_PORT);
})