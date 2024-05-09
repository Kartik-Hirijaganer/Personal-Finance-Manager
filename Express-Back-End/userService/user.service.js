'use strict';

const User = require('./user.model');
const { DatabaseError, RecordNotFoundError, ValidationError } = require('../shared/errors');

const getUser = async (req, res) => {
  let email, userId, user;
  const type = req?.headers?.type;
  if (type === 'email') {
    email = req?.params?.userId;
  } else {
    userId = req?.params?.userId;
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
      return res.status(200).send({ errorMessage: 'Failed to get user data', err });
    }
    const error = new DatabaseError(err.message);
    return res.status(200).send({ errorMessage: 'Failed to get user data', error });
  }
  return res.status(200).send({ user });
}

const addNewUser = async (req, res) => {
  const payload = req.body;
  const new_user = new User(payload);
  try {
    await new_user.save();
  } catch (err) {
    const error = new DatabaseError(err.message);
    return res.status(200).send({ errorMessage: 'Failed to save user data', error });
  }
  return res.status(200).send({ userId: payload?.userId });
}

const updateUser = async (req, res) => {
  const userId = req?.params?.userId;
  const query = { userId };
  const updatedUser = { ...req.body };
  try {
    const user = await User.findOne(query);
    if (!user) {
      throw new RecordNotFoundError(`User record with id: ${userId} not found`);
    }
    await User.findOneAndUpdate(query, updatedUser);
  } catch (err) {
    const errorMessage = 'Failed to update user data';
    if (err instanceof RecordNotFoundError) {
      return res.status(200).send({ errorMessage, err });
    }
    const error = new DatabaseError(err.message);
    return res.status(200).send({ errorMessage, error });
  }
  return res.status(200).send({ userId });
}

const deleteUser = async (req, res) => {
  const id = req?.params?.id;
  const query = { userId: id };
  try {
    await User.findOneAndDelete(query);
  } catch (err) {
    const error = new DatabaseError(err.message);
    return res.status(200).send({ errorMessage: 'Failed to delete user data', error });
  }
  return res.status(200).send({ userId: id });
}

module.exports = {
  addNewUser,
  getUser,
  updateUser,
  deleteUser
}