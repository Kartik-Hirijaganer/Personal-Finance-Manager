'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4 } = require('uuid');

const AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
const lambda = new AWS.Lambda();

const { AuthenticationError, DatabaseError, UserNotFoundError, UnknownError } = require('./errors');
const { logger, generateResponse } = require('./authService');


exports.handler = async (event) => {
  const { email, password } = JSON.parse(event.body);
  const method = event?.queryStringParameters?.method;

  switch (method) {
    case 'login':
      return login(email, password);
    case 'register':
      return register(payload);
    case 'authorize':
      return authorize(event.authorizationToken);
  }
}

const login = async (email, password) => {
  let user;
  const params = {
    FunctionName: process.env.USER_LAMBDA_ARN,
    InvocationType: 'RequestResponse',
    LogType: 'Tail',
    Payload: { "method": "get_user", "type": "email" }
  }
  try {
    user = await lambda.invoke(params).promise();
    if (!user) {
      throw new UserNotFoundError('User not found');
    }
  } catch (error) {
    if (error instanceof DatabaseError) {
      logger.log({ level: 'error', message: `DatabaseError: ${error.message}`, error: JSON.stringify(error) });
      return generateResponse(400, 'Failed to fetch user', { errorMessage: 'Failed to fetch user', error });
    }
    if (error instanceof UserNotFoundError) {
      logger.log({ level: 'error', message: `User with email address ${email} does not exsits`, error: JSON.stringify(error) });
      return generateResponse(400, `User with email address ${email} does not exsits`, { errorMessage: `User with email address ${email} does not exsits`, error });
    }
    const err = new UnknownError(error.message);
    logger.log({ level: 'error', message: `Unknown error: ${error.message}`, error: JSON.stringify(error) });
    return generateResponse(500, `Unknown error: ${error.message}`, { errorMessage: `Unknown error: ${error.message}`, err });
  }

  if (!user || !(await bcrypt.compare(password, user.password))) {
    const error = new AuthenticationError('Invalid credentials');
    logger.log({ level: 'error', message: `Authentication Error`, error: JSON.stringify(error) });
    return generateResponse(401, 'Authentication Error', { errorMessage: 'Invalid credentials', error });
  }

  // Generate token
  const token = jwt.sign({ userId: user.userId }, process.env.SECRET_KEY, { expiresIn: '1h' });
  return generateResponse(200, 'Successfully fetched accounts', { token, userId: user.userId, accountId: user?.accounts[0] || '', profile_img: user.profile_img, user: user.fname });
}

const register = async (payload) => {
  const params = {
    FunctionName: process.env.USER_LAMBDA_ARN,
    InvocationType: 'RequestResponse',
    LogType: 'Tail',
    Payload: { "method": "add_new_user", "type": "email", "body": payload }
  }
  let userId = '';
  let user = '';
  try {
    const encryptedPassword = bcrypt.hashSync(payload.password, 10);
    const payloadWithPassword = { ...payload.body, userId: v4(), password: encryptedPassword };
    user = payloadWithPassword.fname;
    const response = await lambda.invoke(params).promise();
    if (response?.data?.error) {
      const error = response.data.error;
      logger.log({ level: 'error', message: `${error.message}`, error: JSON.stringify(error) });
      return generateResponse(400, 'Failed to register user', { errorMessage: 'Failed to register user', error });
    }
    userId = response.data?.userId || '';
  } catch (err) {
    const error = new UnknownError(err.message);
    logger.log({ level: 'error', message: `Unknown error: ${error.message}`, error: JSON.stringify(error) });
    return generateResponse(500, 'Unknown error', { errorMessage: 'Unknown error', error });
  }
  const token = jwt.sign({ userId }, process.env.SECRET, { expiresIn: '1h' });
  return generateResponse(200, 'Successfully registered user', { userId, token, accountId: '', user });
}

const authorize = async (authHeader) => {
  const token = authHeader.split('')[1];
  try {
    jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    logger.error({ level: 'error', message: 'User not authorized', error });
    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: event.methodArn,
          },
        ],
      },
    };
  }
  return {
    principalId: 'user',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: event.methodArn,
        },
      ],
    },
  };
}
