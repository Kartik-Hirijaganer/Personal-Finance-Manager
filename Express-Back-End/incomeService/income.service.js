'use strict';

const util = require('../shared/util');
const Income = require('./income.model');
const { DatabaseError, RecordNotFoundError } = require('../shared/errors');

const getIncome = async (req, res) => {
  let incomes = [];
  const id = req?.query?.id;
  try {
    if (id) {
      incomes = await Income.findOne({ id });
    } else {
      incomes = await Income.find();
    }
  } catch (err) {
    const error = new DatabaseError(err.message);
    return res.status(400).send({ errorMessage: 'Failed to get income data', error });
  }
  return res.status(200).send({ incomes });
}

const addNewIncome = async (req, res) => {
  console.log(req.body)
  const { from, date, amount, description } = req.body;
  const incomeId = util.generateID(from);
  const new_income = new Income({ id: incomeId, from, date, amount: parseInt(amount), description });
  try {
    await new_income.save();
  } catch (err) {
    const error = new DatabaseError(err.message);
    return res.status(400).send({ errorMessage: 'Failed to save income data', error });
  }
  return res.status(200).send({ incomeId: incomeId.toString() });
}

const updateIncome = async (req, res) => {
  const id = req?.params?.id;
  const query = { id };
  const { from, date, amount, description } = req.body;
  const updatedIncome = { id, from, date, amount: parseInt(amount), description };
  try {
    const income = Income.findOne(query);
    if (!income) {
      throw new RecordNotFoundError(`Income record with id: ${id} not found`);
    }
    await Income.findOneAndUpdate(query, updatedIncome);
  } catch (err) {
    const errorMessage = 'Failed to update income data';
    if (err instanceof RecordNotFoundError) {
      return res.status(400).send({ errorMessage, err });
    }
    const error = new DatabaseError(err.message);
    return res.status(400).send({ errorMessage, error });
  }
  return res.status(200).send({ incomeId: id });
}

const deleteIncome = async (req, res) => {
  const id = req?.params?.id;
  const query = { id };
  try {
    await Income.findOneAndDelete(query);
  } catch (err) {
    const error = new DatabaseError(err.message);
    return res.status(400).send({ errorMessage: 'Failed to delete income data', error });
  }
  return res.status(200).send({ incomeId: id });
}

module.exports = {
  addNewIncome,
  getIncome,
  updateIncome,
  deleteIncome
}