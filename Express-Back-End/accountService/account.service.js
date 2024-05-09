'use strict';

const { v4 } = require('uuid');

const { RecordNotFoundError, DatabaseError } = require('../shared/errors');
const Account = require('./account.model');

const getAccounts = async (req, res) => {
  const userId = req.query.userId;
  let accounts = [];
  try {
    accounts = await Account.find({ userId });
    if (accounts.length < 1) {
      throw new RecordNotFoundError(`No record with user id ${userId} was found`);
    }
  } catch (error) {
    if (error instanceof RecordNotFoundError) {
      return res.status(400).send({ accounts });
    }
    const dbError = new DatabaseError(error.message);
    return res.status(400).send({ errorMessage, dbError });
  }
  return res.status(200).send({ accounts });
}

const getAccount = async (req, res) => {
  const accountId = req.params.accountId;
  let account = {};
  try {
    account = await Account.findOne({ accountId });
    if (account) {
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
  const payload = { ...req.body, accountId: v4() };
  const account = new Account(payload);
  try {
    await account.save();
  } catch (error) {
    const dbError = new DatabaseError(error.message);
    return res.status(400).send({ errorMessage: 'Failed to save account', dbError });
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