'use strict';

const util = require('../shared/util');
const Expense = require('./expense.model');

const getExpense = async (req, res) => {
  let expenses = [];
  const id = req?.params?.id;
  try {
    if (id) {
      expenses = await Expense.findOne({ id });
    } else {
      expenses = await Expense.find();
    }
  } catch (error) {
    console.log(error);
    res.status(400).send('Failed to get data');
  }
  res.status(200).send({ expenses });
}

const addNewExpense = async (req, res) => {
  const { to, date, amount, description } = req.body;
  const expenseId = util.generateID(to);
  const new_expense = new Expense({ id: expenseId, to, date, amount: parseInt(amount), description });
  try {
    await new_expense.save();
  } catch (error) {
    console.log(error);
    res.status(400).send('Failed to save data');
  }
  res.status(200).send({ expenseId: expenseId.toString() });
}

const updateExpense = async (req, res) => {
  const id = req?.params?.id;
  const query = { id };
  const { to, date, amount, description } = req.body;
  const updatedExpense = { id, to, date, amount: parseInt(amount), description };
  try {
    await Expense.findOneAndUpdate(query, updatedExpense);
  } catch (error) {
    console.log(error);
    res.status(400).send('Failed to update data');
  }
  res.status(200).send({ expenseId: id });
}

const deleteExpense = async (req, res) => {
  const id = req?.params?.id;
  const query = { id };
  try {
    await Expense.findOneAndDelete(query);
  } catch (error) {
    console.log(error);
    res.status(400).send('Failed to delete data');
  }
  res.status(200).send({ expenseId: id });
}

module.exports = {
  addNewExpense,
  getExpense,
  updateExpense,
  deleteExpense
}