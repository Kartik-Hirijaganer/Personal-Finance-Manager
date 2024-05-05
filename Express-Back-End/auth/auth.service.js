'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const http = require('http');

const { AuthenticationError, DatabaseError, UserNotFoundError, UnknownError } = require('../shared/errors');

const httprequest = (options, payload) => {
  return new Promise((resolve, reject) => {

    const req = http.request(options, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error('statusCode=' + res.statusCode));
      }
      let body = [];
      res.on('data', function (chunk) {
        body.push(chunk);
      });
      res.on('end', function () {
        try {
          body = JSON.parse(Buffer.concat(body).toString());
        } catch (e) {
          reject(e);
        }
        resolve(body);
      });
    });
    req.on('error', (e) => {
      reject(e.message);
    });
    if (options.method === 'POST') {
      // Write data to request body
      req.write(payload);
    }
    // send the request
    req.end();
  });
}

const getUser = async (type, id) => {
  const options = {
    hostname: 'localhost',
    port: process.env.USER_PORT,
    path: `/user/${id}`,
    headers: { type: type },
    method: 'GET',
    agent: false,  // Create a new agent just for this one request. Agent manages the connection,
    timeout: 10000
  }
  try {
    return httprequest(options);
  } catch (error) {
    throw new DatabaseError(error.message);
  }
}

const login = async (req, res) => {
  const { email, password } = req.body;
  const type = req.headers?.type;
  let user;
  try {
    const response = await getUser(type, email);
    user = response.user;
    if (!user) {
      throw new UserNotFoundError('User not found');
    }
  } catch (error) {
    if (error instanceof DatabaseError) {
      return res.status(400).send({ errorMessage: 'Failed to fetch user', error });
    }
    if (error instanceof UserNotFoundError) {
      return res.status(400).send({ errorMessage: `User with email address ${email} does not exsits` })
    }
    const err = new UnknownError(error.message);
    return res.status(500).send({ errorMessage: 'Unkown error', err });
  }

  if (!user || !(await bcrypt.compare(password, user.password))) {
    const error = new AuthenticationError('Invalid credentials');
    return res.status(401).send({ errorMessage: 'Invalid credentials', error });
  }

  // Generate token
  const token = jwt.sign({ userId: user.userId }, process.env.SECRET, { expiresIn: '1h' });
  return res.status(200).send({ token, userId: user.userId });
}

const register = async (req, res) => {
  const { password, ...postData } = req.body;
  const options = {
    hostname: 'localhost',
    port: process.env.USER_PORT,
    path: '/user/add',
    method: 'POST',
    agent: false,  // Create a new agent just for this one request. Agent manages the connection,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  let userId;
  try {
    postData['password'] = bcrypt.hashSync(password, 10);
    const payload = JSON.stringify(postData);
    options.headers['Content-Length'] = Buffer.byteLength(payload);
    (userId = await httprequest(options, payload));
  } catch (err) {
    if (err instanceof DatabaseError) {
      return res.status(400).send({ errorMessage: 'Failed to save user data', error });
    }
    const error = new UnknownError(err.message);
    return res.status(400).send({ errorMessage: 'Unknown error', error });
  }
  const token = jwt.sign({ userId }, process.env.SECRET, { expiresIn: '1h' });
  return res.status(200).send({ userId, token });
}

const authorize = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).send({ errorMessage: 'Token required' }); //  make custom error
  }
  jwt.verify(token, process.env.SERECT, (err, user) => {
    if (err) return res.status(403).send({ errorMessage: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

module.exports = {
  login,
  register,
  authorize
}