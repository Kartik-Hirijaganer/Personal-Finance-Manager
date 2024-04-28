'use strict';

const util = require('../shared/util');
const Liability = require('./liability.model');

const getLiability = async (req, res) => {
  let liabilities = [];
  const id = req?.params?.id;
  try {
    if (id) {
      liabilities = await Liability.findOne({ id });
    } else {
      liabilities = await Liability.find();
    }
  } catch (error) {
    console.log(error);
    res.status(400).send('Failed to get data');
  }
  res.status(200).send({ liabilities });
}

const addNewLiability = async (req, res) => {
  const { name, due_date, amount, description } = req.body;
  const liabilityId = util.generateID();
  const new_liability = new Liability({ id: liabilityId, name, due_date, amount: parseInt(amount), description });
  try {
    await new_liability.save();
  } catch (error) {
    console.log(error);
    res.status(400).send('Failed to save data');
  }
  res.status(200).send({ liabilityId: liabilityId.toString() });
}

const updateLiability = async (req, res) => {
  const id = req?.params?.id;
  const query = { id };
  const { name, due_date, amount, description } = req.body;
  const updatedLiability = { id, name, due_date, amount: parseInt(amount), description };
  try {
    await Liability.findOneAndUpdate(query, updatedLiability);
  } catch (error) {
    console.log(error);
    res.status(400).send('Failed to update data');
  }
  res.status(200).send({ liabilityId: id });
}

const deleteLiability = async (req, res) => {
  const id = req?.params?.id;
  const query = { id };
  try {
    await Liability.findOneAndDelete(query);
  } catch (error) {
    console.log(error);
    res.status(400).send('Failed to delete data');
  }
  res.status(200).send({ liabilityId: id });
}

module.exports = {
  addNewLiability,
  getLiability,
  updateLiability,
  deleteLiability
}