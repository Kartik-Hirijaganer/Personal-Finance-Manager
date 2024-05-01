'use strict';

const util = require('../shared/util');
const Expense = require('./expense.model');
const { DatabaseError, RecordNotFoundError } = require('../shared/errors');

const getExpense = async (req, res) => {
  let expenses = [];
  const id = req?.query?.id;
  try {
    if (id) {
      expenses = await Expense.findOne({ id });
    } else {
      expenses = await Expense.find();
    }
  } catch (err) {
    const error =  new DatabaseError(err.message);
    return res.status(200).send({ errorMessage: 'Failed to get expense data', error });
  }
  return res.status(200).send({ expenses });
}

const addNewExpense = async (req, res) => {
  const { to, date, amount, description } = req.body;
  const expenseId = util.generateID(to);
  const new_expense = new Expense({ id: expenseId, to, date, amount: parseInt(amount), description });
  try {
    await new_expense.save();
  } catch (err) {
    const error = new DatabaseError(err.message);
    return res.status(400).send({ errorMessage: 'Failed to save expense data', error });
  }
  return res.status(200).send({ expenseId: expenseId.toString() });
}

const updateExpense = async (req, res) => {
  const id = req?.params?.id;
  const query = { id };
  const { to, date, amount, description } = req.body;
  const updatedExpense = { id, to, date, amount: parseInt(amount), description };
  try {
    const expense = await Expense.findOne(query);
    if (!expense) {
      throw new RecordNotFoundError(`Expense record with id: ${id} not found`);
    }
    await Expense.findOneAndUpdate(query, updatedExpense);
  } catch (err) {
    const errorMessage = 'Failed to update expense data';
    if (err instanceof RecordNotFoundError) {
      return res.status(200).send({ errorMessage, err });
    }
    const error = new DatabaseError(err.message);
    return res.status(200).send({ errorMessage, error });
  }
  return res.status(200).send({ expenseId: id });
}

const deleteExpense = async (req, res) => {
  const id = req?.params?.id;
  const query = { id };
  try {
    await Expense.findOneAndDelete(query);
  } catch (err) {
    const error = new DatabaseError(err.message);
    return res.status(200).send({ errorMessage: 'Failed to delete expense data', error });
  }
  return res.status(200).send({ expenseId: id });
}

module.exports = {
  addNewExpense,
  getExpense,
  updateExpense,
  deleteExpense
}