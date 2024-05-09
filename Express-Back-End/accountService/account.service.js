'use strict';

const { v4 } = require('uuid');
const axios = require('axios');

const { RecordNotFoundError, DatabaseError } = require('../shared/errors');
const Account = require('./account.model');

const getAccounts = async (req, res) => {
  const userId = req.query.userId;
  const isNewUser = req.headers['user-type'] === 'new';
  let accounts = [];
  try {
    accounts = await Account.find({ userId });
    if (!isNewUser && accounts.length < 1) {
      throw new RecordNotFoundError(`No record with user id ${userId} was found`);
    }
  } catch (error) {
    if (error instanceof RecordNotFoundError) {
      return res.status(400).send({ accounts });
    }
    const dbError = new DatabaseError(error.message);
    return res.status(400).send({ errorMessage: 'Failed to get user accounts', error: dbError });
  }
  return res.status(200).send(accounts);
}

const getAccount = async (req, res) => {
  const accountId = req.params.accountId;
  let account = {};
  try {
    account = await Account.findOne({ accountId });
    if (!account) {
      throw new RecordNotFoundError(`No record for account ${accountId} was found`);
    }
  } catch (error) {
    if (error instanceof RecordNotFoundError) {
      return res.status(400).send({ account });
    }
    const dbError = new DatabaseError(error.message);
    return res.status(400).send({ errorMessage, dbError });
  }
  return res.status(200).send({ account });
}

const addAccount = async (req, res) => {
  const payload = { ...req.body, accountId: v4(), incomes: [], expenses: [], liabilities: [] };
  const account = new Account(payload);
  const headers = { 'authorization': req.headers['authorization'], 'Content-Type': 'application/json' }
  try {
    await account.save();
    const user = await axios.get(`http://localhost:3300/user/${payload.userId}`, { headers });
    const accounts = [...(user.accounts || []), payload.accountId];
    await axios.put(`http://localhost:3300/user/update/${payload.userId}`, { accounts }, { headers });
  } catch (error) {
    if (error instanceof DatabaseError) {
      return res.status(400).send(error);
    }
    const dbError = new DatabaseError(error.message);
    return res.status(400).send({ errorMessage: 'Failed to save account', error: dbError });
  }
  return res.status(200).send({ accountId: payload.accountId });
}

const deleteAccount = async (req, res) => {
  const accountId = req.params.accountId;
  try {
    await Account.findOneAndDelete({ accountId });
  } catch (error) {
    const dbError = new DatabaseError(error.message);
    return res.status(400).send({ errorMessage, dbError });
  }
  return res.status(200).send({ accountId });
}

const deleteAccounts = async (req, res) => {
  const userId = req.query.userId;
  let deleteCount = 0;
  try {
    deleteCount = await Account.deleteMany({ userId });
  } catch (error) {
    const dbError = new DatabaseError(error.message);
    return res.status(400).send({ errorMessage, dbError });
  }
  return res.status(200).send({ deleteCount });
}

module.exports = {
  getAccount,
  getAccounts,
  addAccount,
  deleteAccount,
  deleteAccounts
}