'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
const lambda = new AWS.Lambda();

const { AuthenticationError, DatabaseError, UserNotFoundError, UnknownError } = require('./error');
const { logger, generateResponse } = require('./authService');

exports.handler = async (event) => {
  logger.log({ level: 'info', message: 'Input event', event });
  const method = event?.queryStringParameters?.method;
  switch (method) {
    case 'login':
      const { email, password } = JSON.parse(event.body);
      return login(email, password);
    case 'register':
      const payload = JSON.parse(event.body);
      return register(payload);
    case 'reset':
      const { email: user_email, repass: new_password } = JSON.parse(event.body);
      return reset(user_email, new_password);
    default:
      return authorize(event.authorizationToken, event.methodArn);
  }
}

const login = async (email, password) => {
  let user;
  const params = {
    FunctionName: process.env.USER_LAMBDA_ARN,
    InvocationType: 'RequestResponse',
    LogType: 'Tail',
    Payload: JSON.stringify({ queryStringParameters: { "method": "get_user", "type": "email" }, body: { userId: email } })
  }
  try {
    logger.log({ level: 'info', params });
    let response = await lambda.invoke(params).promise();
    response = JSON.parse(response.Payload);
    user = response?.body && JSON.parse(response.body)?.response;
    if (!user) {
      throw new UserNotFoundError('User not found');
    }
  } catch (error) {
    if (error instanceof DatabaseError) {
      return generateResponse(400, 'Failed to fetch user', { errorMessage: 'Failed to fetch user', error });
    }
    if (error instanceof UserNotFoundError) {
      return generateResponse(400, `User with email address ${email} does not exsits`, { errorMessage: `User with email address ${email} does not exsits`, error });
    }
    const err = new UnknownError(error.message);
    return generateResponse(500, `Unknown error: ${error.message}`, { errorMessage: `Unknown error: ${error.message}`, err });
  }
  if (!user || !(await bcrypt.compare(password, user.password))) {
    const error = new AuthenticationError('Invalid credentials');
    return generateResponse(401, 'Authentication Error', { errorMessage: 'Invalid credentials', error });
  }
  const token = jwt.sign({ userId: user.userId }, process.env.SECRET_KEY, { expiresIn: '1h' });
  return generateResponse(200, 'Successfully fetched accounts', { token, userId: user.userId, accountId: user?.accounts[0] || '', profile_img: user.profile_img, user: user.fname });
}

const register = async (payload) => {
  let params = {
    FunctionName: process.env.USER_LAMBDA_ARN,
    InvocationType: 'RequestResponse',
    LogType: 'Tail',
    Payload: { queryStringParameters: { "method": "add_new_user" } }
  }
  let userId = '';
  const user = payload.fname;
  try {
    params.Payload = JSON.stringify({
      queryStringParameters: { "method": "add_new_user" },
      body: { ...payload, password: bcrypt.hashSync(payload.password, 10) }
    });
    logger.log({ level: 'info', params });
    let response = await lambda.invoke(params).promise();
    response = JSON.parse(response.Payload);
    if (response?.statusCode > 399) {
      const error = JSON.parse(response.body);
      return generateResponse(400, 'Failed to register user', { errorMessage: error.message, error: error.response });
    }
    userId = JSON.parse(response.body)?.response?.userId || '';
  } catch (err) {
    const error = new UnknownError(err.message);
    return generateResponse(500, 'Unknown error', { errorMessage: 'Unknown error', error });
  }
  const token = jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: '1h' });
  return generateResponse(200, 'Successfully registered user', { userId, token, accountId: '', user });
}

const reset = async (email, password) => {
  const params = {
    FunctionName: process.env.USER_LAMBDA_ARN,
    InvocationType: 'RequestResponse',
    LogType: 'Tail',
    Payload: JSON.stringify({ queryStringParameters: { "method": "update_user", "type": "email" }, body: { email, password } })
  }
  try {
    logger.log({ level: 'info', params });
    let response = await lambda.invoke(params).promise();
    response = JSON.parse(response.Payload);
    const responseBody = JSON.parse(response.body);
    const token = jwt.sign({ userId: responseBody?.response?.userId }, process.env.SECRET_KEY, { expiresIn: '1h' });
    return generateResponse(200, 'Password reset successfull', { token, userId: responseBody?.response?.userId, accountId: responseBody?.response?.accountId, profile_img: responseBody?.response.profile_img, user: responseBody?.response.user });
  } catch (error) {
    return generateResponse(400, `Failed to reset password`, { errorMessage: `${error.message}`, error });
  }
}

const authorize = async (authHeader, methodArn) => {
  const token = authHeader.split(' ')[1];
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
            Resource: methodArn,
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
          Resource: methodArn
        },
      ],
    },
  };
}
