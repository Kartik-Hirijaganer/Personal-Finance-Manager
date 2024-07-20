'use strict';

const { v4 } = require('uuid');

const AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
const lambda = new AWS.Lambda();

const { connectDB, logger, generateResponse } = require('./accountService');
const Account = require('./models/account.model');
const { RecordNotFoundError, DatabaseError } = require('./errors');

connectDB();

exports.handler = async (event) => {
  logger.log({ level: 'info', message: 'Input event', event: JSON.stringify(event) });
  let userId = null;
  let accountId = null;
  let accountNo = null;
  const method = event?.queryStringParameters?.method;
  const { body, headers } = event;
  if (event.pathParameters) {
    (userId, accountId, accountNo) = event.pathParameters;
  }
  const payload = { userId, accountId, body, headers };

  switch (method) {
    case 'get_accounts':
      return getAccounts(payload);
    case 'get_account':
      return getAccount(payload);
    case 'add_account':
      return addAccount(payload);
    case 'delete_account':
      return deleteAccount(payload);
    case 'delete_accounts':
      return deleteAccounts(payload);
    default:
      return generateResponse(200, 'Enter valid method', { method });
  }
}

const getAccounts = async (payload) => {
  const userId = payload?.userId;
  let accounts = [];
  try {
    accounts = await Account.find({ userId });
    if (accounts.length < 1) {
      throw new RecordNotFoundError(`No record with user id ${userId} was found`);
    }
  } catch (error) {
    if (error instanceof RecordNotFoundError) {
      logger.log({ level: 'error', message: 'RecordNotFoundError', error: JSON.stringify(error) });
      return generateResponse(400, 'RecordNotFoundError', { accounts });
    }
    const dbError = new DatabaseError(error.message);
    logger.log({ level: 'error', message: `DatabaseError: ${error.message}`, error: JSON.stringify(dbError) });
    return generateResponse(400, 'Failed to get user accounts', { errorMessage: 'Failed to get user accounts', error: dbError });
  }
  return generateResponse(200, 'Successfully fetched accounts', { accounts });
}

const getAccount = async (payload) => {
  const accountId = payload?.accountId;
  let account = {};
  try {
    account = await Account.findOne({ accountId });
    if (!account) {
      throw new RecordNotFoundError(`No record for account ${accountId} was found`);
    }
  } catch (error) {
    if (error instanceof RecordNotFoundError) {
      logger.log({ level: 'error', message: 'RecordNotFoundError', error: JSON.stringify(error) });
      return generateResponse(400, 'RecordNotFoundError', { error });
    }
    const dbError = new DatabaseError(error.message);
    logger.log({ level: 'error', message: `DatabaseError: ${error.message}`, error: JSON.stringify(dbError) });
    return generateResponse(400, 'Failed to get user account', { errorMessage: 'Failed to get user account', error: dbError });
  }
  return generateResponse(200, 'Successfully fetched user account', { account });
}

const addAccount = async (payload) => {
  const accountData = { ...payload.body, accountId: v4(), incomes: [], expenses: [], liabilities: [] };
  const account = new Account(accountData);
  const params = {
    FunctionName: process.env.USER_LAMBDA_ARN,
    InvocationType: 'RequestResponse',
    LogType: 'Tail'
  }
  try {
    await account.save();
    params.accountData = `{ "userId": ${accountData.userId}, "method": "get_user" }`;
    const user = await lambda.invoke(params).promise();
    const accounts = [...(user.accounts || []), accountData.accountId];
    params.accountData = `{ "userId": ${accountData.userId}, "method": "update_user", "accounts": ${accounts} }`;
    await lambda.invoke(params).promise();
  } catch (error) {
    if (error instanceof DatabaseError) {
      logger.log({ level: 'error', message: `DatabaseError: ${error.message}`, error: JSON.stringify(error) });
      return generateResponse(400, 'Failed to add account', { errorMessage: 'Failed to add account', error });
    }
    const dbError = new DatabaseError(error.message);
    logger.log({ level: 'error', message: `DatabaseError: ${error.message}`, error: JSON.stringify(dbError) });
    return generateResponse(400, 'Failed to add account', { errorMessage: 'Failed to add account', error: dbError });
  }
  return generateResponse(200, 'Successfully added account', { accountId: accountData.accountId });
}

const deleteAccount = async (payload) => {
  const accountNo = payload?.accountNo;
  try {
    await Account.findOneAndDelete({ accountNo });
  } catch (error) {
    const dbError = new DatabaseError(error.message);
    logger.log({ level: 'error', message: `DatabaseError: ${error.message}`, error: JSON.stringify(dbError) });
    return generateResponse(400, 'Failed to delete account', { errorMessage: 'Failed to delete account', error: dbError });
  }
  return generateResponse(200, 'Successfully deleted account', { accountNo });
}

const deleteAccounts = async (payload) => {
  const userId = payload?.userId;
  let deleteCount = 0;
  try {
    deleteCount = await Account.deleteMany({ userId });
  } catch (error) {
    const dbError = new DatabaseError(error.message);
    logger.log({ level: 'error', message: `DatabaseError: ${error.message}`, error: JSON.stringify(dbError) });
    return generateResponse(400, 'Failed to delete accounts associated with user.', { errorMessage: 'Failed to delete accounts associated with user.', error: dbError });
  }
  return generateResponse(200, 'Successfully deleted accounts', { deleteCount });
}

module.exports = {
  getAccount,
  getAccounts,
  addAccount,
  deleteAccount,
  deleteAccounts
}