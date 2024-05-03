'use strict';

const util = require('../shared/util');
const User = require('./user.model');
const { DatabaseError, RecordNotFoundError, ValidationError } = require('../shared/errors');

const getUser = async (req, res) => {
  let user;
  const id = req?.params?.id;
  try {
    if (id) {
      user = await User.findOne({ id });
    } else {
      throw new ValidationError('Missing user id in path');
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
  const userId = req.body.id;
  const new_user = new User({ ...req.body });
  try {
    await new_user.save();
  } catch (err) {
    const error = new DatabaseError(err.message);
    return res.status(400).send({ errorMessage: 'Failed to save user data', error });
  }
  return res.status(200).send({ userId: userId.toString() });
}

const updateUser = async (req, res) => {
  const id = req?.params?.id;
  const query = { id };
  const updatedUser = { ...req.body };
  try {
    const user = await User.findOne(query);
    if (!user) {
      throw new RecordNotFoundError(`User record with id: ${id} not found`);
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
  return res.status(200).send({ userId: id });
}

const deleteUser = async (req, res) => {
  const id = req?.params?.id;
  const query = { id };
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