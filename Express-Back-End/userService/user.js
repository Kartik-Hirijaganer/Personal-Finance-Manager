'use strict';

const { v4 } = require('uuid');
const bcrypt = require('bcryptjs');
const { generatePdf, connectDB, logger, generateResponse } = require('./userService');

const User = require('./models/user.model');
const Account = require('./models/account.model');
const { DatabaseError, RecordNotFoundError, ValidationError } = require('./errors');

let isDBConnected = false;

exports.handler = async (event) => {
  logger.log({level: 'info', message: 'Input event', event});
  if (!isDBConnected) {
    await connectDB();
    isDBConnected = true;
  }
  let userId = '';
  const method = event?.queryStringParameters?.method;
  const type = event?.queryStringParameters?.type;
  if (event.pathParameters) {
    userId = event.pathParameters?.userId;
  } else {
    userId = event?.body?.userId || event?.name;
  }
  const payload = { userId, type, body: event.body, headers: event.headers };
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
      return generateResponse(400, 'Enter valid method', { method });
  }
}

const getUser = async (payload) => {
  const { userId, type } = payload;
  let user;
  try {
    if (type === 'email') {
      user = await User.findOne({ email: userId });
    } else {
      user = await User.findOne({ userId });
    }
  } catch (err) {
    if (err instanceof ValidationError) {
      logger.log({ level: 'error', message: `ValidationError: ${err.message}`, error: JSON.stringify(err) });
      return generateResponse(400, 'Failed to get user data', err);
    }
    const error = new DatabaseError(err.message);
    logger.log({ level: 'error', message: `DatabaseError: ${err.message}`, error: JSON.stringify(error) });
    return generateResponse(400, 'Failed to get user data', error);
  }
  return generateResponse(200, 'Successfully fetched user data', user);
}

const addNewUser = async (payload) => {
  const userId = v4();
  const new_user = new User({ ...payload.body, userId });
  try {
    await new_user.save();
  } catch (err) {
    const error = new DatabaseError(err.message);
    logger.log({ level: 'error', message: `DatabaseError: ${err.message}`, error: JSON.stringify(error) });
    return generateResponse(400, 'Failed to save user data', error);
  }
  return generateResponse(200, 'Added new user', { userId });
}

const updateUser = async (payload) => {
  let user;
  try {
    const encryptedPassword = payload?.body?.password && bcrypt.hashSync(payload.body.password, 10);
    if (payload.type === 'email') {
      user = await User.findOne({ email: payload?.body?.email });
    } else {
      user = await User.findOne({ userId: payload.userId });
    }
    if (!user) {
      throw new RecordNotFoundError(`User record with id: ${payload.userId || payload?.body?.email} not found`);
    }
    const updatedUser = { ...user, ...(encryptedPassword && { password: encryptedPassword }) };
    await User.findOneAndUpdate({ userId: user?.userId }, updatedUser);
  } catch (err) {
    if (err instanceof RecordNotFoundError) {
      return generateResponse(400, 'Not user record found', err);
    }
    const error = new DatabaseError(err.message);
    return generateResponse(400, 'Failed to update user data', error);
  }
  return generateResponse(200, 'User data updated', { userId: user.userId, accountId: user?.accounts?.[0] || '', profile_img: user.profile_img, user: user.fname });
}

const deleteUser = async (payload) => {
  const userId = payload?.userId;
  const query = { userId };
  try {
    await Account.findOneAndDelete(query);
    await User.findOneAndDelete(query);
  } catch (err) {
    const error = new DatabaseError(err.message);
    logger.log({ level: 'error', message: `DatabaseError: ${err.message}`, error: JSON.stringify(error) });
    return generateResponse(400, 'Failed to delete user data', error);
  }
  return generateResponse(200, 'Successfully deleted user data', { userId });
}