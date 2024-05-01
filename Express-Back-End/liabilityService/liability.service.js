'use strict';

const util = require('../shared/util');
const Liability = require('./liability.model');
const { DatabaseError, RecordNotFoundError } = require('../shared/errors');

const getLiability = async (req, res) => {
  let liabilities = [];
  const id = req?.query?.id;
  try {
    if (id) {
      liabilities = await Liability.findOne({ id });
    } else {
      liabilities = await Liability.find();
    }
  } catch (err) {
    const error = new DatabaseError(err.message);
    return res.status(200).send({ errorMessage: 'Failed to get liability data', error });
  }
  return res.status(200).send({ liabilities });
}

const addNewLiability = async (req, res) => {
  const { name, due_date, amount, description } = req.body;
  const liabilityId = util.generateID(name);
  const new_liability = new Liability({ id: liabilityId, name, due_date, amount: parseInt(amount), description });
  try {
    await new_liability.save();
  } catch (err) {
    const error = new DatabaseError(err.message);
    return res.status(400).send({ errorMessage: 'Failed to save liability data', error });
  }
  return res.status(200).send({ liabilityId: liabilityId.toString() });
}

const updateLiability = async (req, res) => {
  const id = req?.params?.id;
  const query = { id };
  const { name, due_date, amount, description } = req.body;
  const updatedLiability = { id, name, due_date, amount: parseInt(amount), description };
  try {
    const liability = await Liability.findOne(query);
    if (!liability) {
      throw new RecordNotFoundError(`Liability record with id: ${id} not found`);
    }
    await Liability.findOneAndUpdate(query, updatedLiability);
  } catch (err) {
    const errorMessage = 'Failed to update liability data';
    if (err instanceof RecordNotFoundError) {
      return res.status(200).send({ errorMessage, err });
    }
    const error = new DatabaseError(err.message);
    return res.status(200).send({ errorMessage, error });
  }
  return res.status(200).send({ liabilityId: id });
}

const deleteLiability = async (req, res) => {
  const id = req?.params?.id;
  const query = { id };
  try {
    await Liability.findOneAndDelete(query);
  } catch (err) {
    const error = new DatabaseError(err.message);
    return res.status(200).send({ errorMessage: 'Failed to delete liability data', error });
  }
  return res.status(200).send({ liabilityId: id });
}

module.exports = {
  addNewLiability,
  getLiability,
  updateLiability,
  deleteLiability
}