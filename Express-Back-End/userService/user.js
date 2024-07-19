'use strict';

// const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { generatePdf, connectDB, logger, generateResponse } = require('./userService');

const User = require('./models/user.model');
const Account = require('./models/account.model');
const { DatabaseError, RecordNotFoundError, ValidationError } = require('../shared/errors');

connectDB();

exports.handler = async (event) => {
  logger.log({level: 'info', message: 'Input event', event: JSON.stringify(event)});
  let userId = null;
  const { method, type } = event.queryStringParameters;
  const { body, headers } = event;
  if (event.pathParameters) {
    userId = event.pathParameters?.userId;
  } else {
    userId = body?.userId;
  }
  event.pathParameters && (userId = event.pathParameters?.userId);
  const payload = { userId, type, body, headers };

  switch (method) {
    case 'get_user':
      return getUser(payload);
    case 'add_new_user':
      return addNewUser(payload);
    case 'update_user':
      return updateUser(payload);
    case 'delete_user':
      return deleteUser(payload);
    case 'generate_pdf':
      return generatePdf(payload, generateResponse)
    default: 
      return generateResponse(200, 'Enter valid method', { method });
  }
}

const getUser = async (payload) => {
  const { userId, type } = payload;
  let email, user;
  if (type === 'email') {
    email = userId;
  }
  try {
    if (userId || email) {
      if (email) {
        user = await User.findOne({ email });
      } else {
        user = await User.findOne({ userId });
      }
    } else {
      throw new ValidationError(`Missing ${email ? 'email' : 'user id'} in path`);
    }
  } catch (err) {
    if (err instanceof ValidationError) {
      logger.log({ level: 'erro', message: `ValidationError: ${err.message}`, error: JSON.stringify(err) });
      return generateResponse(200, 'Failed to get user data', err);
    }
    const error = new DatabaseError(err.message);
    logger.log({ level: 'erro', message: `DatabaseError: ${err.message}`, error: JSON.stringify(error) });
    return generateResponse(200, 'Failed to get user data', error);
  }
  return generateResponse(200, 'Successfully fetched user data', user);
}

const addNewUser = async (payload) => {
  const new_user = new User(payload.body);
  try {
    await new_user.save();
  } catch (err) {
    const error = new DatabaseError(err.message);
    logger.log({ level: 'erro', message: `DatabaseError: ${err.message}`, error: JSON.stringify(error) });
    return generateResponse(200, 'Failed to save user data', error);
  }
  return generateResponse(200, 'Added new user', { userId: payload?.userId });
}

const updateUser = async (payload) => {
  const userId = payload?.userId;
  const query = { userId };
  const encryptedPassword = payload.body?.password && bcrypt.hashSync(payload.body.password, 10);
  const updatedUser = { ...payload.body, ...(encryptedPassword && { password: encryptedPassword }) };
  try {
    const user = await User.findOne(query);
    if (!user) {
      throw new RecordNotFoundError(`User record with id: ${userId} not found`);
    }
    await User.findOneAndUpdate(query, updatedUser);
  } catch (err) {
    if (err instanceof RecordNotFoundError) {
      logger.log({ level: 'erro', message: `RecordNotFoundError: ${err.message}`, error: JSON.stringify(err) });
      return generateResponse(200, 'Failed to update user data', err);
    }
    const error = new DatabaseError(err.message);
    logger.log({ level: 'erro', message: `DatabaseError: ${err.message}`, error: JSON.stringify(error) });
    return generateResponse(200, 'Failed to update user data', error);
  }
  return generateResponse(200, 'Successfully updated user data', { userId });
}

const deleteUser = async (payload) => {
  const userId = payload?.userId;
  const query = { userId };
  try {
    await Account.findOneAndDelete(query);
    await User.findOneAndDelete(query);
  } catch (err) {
    const error = new DatabaseError(err.message);
    logger.log({ level: 'erro', message: `DatabaseError: ${err.message}`, error: JSON.stringify(error) });
    return generateResponse(200, 'Failed to delete user data', error);
  }
  return generateResponse(200, 'Successfully deleted user data', { userId });
}