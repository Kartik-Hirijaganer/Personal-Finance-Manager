'use strict';

const util = require('../shared/util');
const Income = require('./income.model');

const getIncome = async (req, res) => {
  let incomes = [];
  const id = req?.params?.id;
  try {
    if (id) {
      incomes = await Income.findOne({ id });
    } else {
      incomes = await Income.find();
    }
  } catch (error) {
    console.log(error);
    res.status(400).send('Failed to get data');
  }
  res.status(200).send({ incomes });
}

const addNewIncome = async (req, res) => {
  const { from, date, amount, description } = req.body;
  const incomeId = util.generateID();
  const new_income = new Income({ id: incomeId, from, date, amount: parseInt(amount), description });
  try {
    await new_income.save();
  } catch (error) {
    console.log(error);
    res.status(400).send('Failed to save data');
  }
  res.status(200).send({ incomeId: incomeId.toString() });
}

const updateIncome = async (req, res) => {
  const id = req?.params?.id;
  const query = { id };
  const { from, date, amount, description } = req.body;
  const updatedIncome = { id, from, date, amount: parseInt(amount), description };
  try {
    await Income.findOneAndUpdate(query, updatedIncome);
  } catch (error) {
    console.log(error);
    res.status(400).send('Failed to update data');
  }
  res.status(200).send({ incomeId: id });
}

const deleteIncome = async (req, res) => {
  const id = req?.params?.id;
  const query = { id };
  try {
    await Income.findOneAndDelete(query);
  } catch (error) {
    console.log(error);
    res.status(400).send('Failed to delete data');
  }
  res.status(200).send({ incomeId: id });
}

module.exports = {
  addNewIncome,
  getIncome,
  updateIncome,
  deleteIncome
}