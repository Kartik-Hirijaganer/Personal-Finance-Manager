'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');
const { v4 } = require('uuid');

const { AuthenticationError, DatabaseError, UserNotFoundError, UnknownError } = require('../shared/errors');

const login = async (req, res) => {
  const { email, password } = req.body;
  const type = req.headers?.type;
  let user;
  try {
    const response = await axios.get(`http://localhost:${process.env.USER_PORT}/user/${email}`, { headers: { type }});
    user = response.data?.user;
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
  return res.status(200).send({ token, userId: user.userId, accountId: user?.accounts[0] || '', profile_img: user.profile_img, user: user.fname });
}

const register = async (req, res) => {
  let userId = '';
  let user = '';
  try {
    const encryptedPassword = bcrypt.hashSync(req.body.password, 10);
    const payload = { ...req.body, userId: v4(), password: encryptedPassword };
    user = payload.fname;
    const response = await axios.post(`http://localhost:${process.env.USER_PORT}/user/add`, payload);
    if (response?.data?.error) {
      const error = response.data.error;
      return res.status(response?.data?.error.status).send({ errorMessage: response.errorMessage, error });
    }
    userId = response.data?.userId || '';
  } catch (err) {
    const error = new UnknownError(err.message);
    return res.status(400).send({ errorMessage: 'Unknown error', error });
  }
  const token = jwt.sign({ userId }, process.env.SECRET, { expiresIn: '1h' });
  return res.status(200).send({ userId, token, accountId: '', user });
}

const authorize = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).send({ errorMessage: 'Token required' }); //  make custom error
  }
  jwt.verify(token, process.env.SECRET, (err, user) => {
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