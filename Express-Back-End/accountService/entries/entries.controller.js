'use strict';

const util = require('../../shared/util');
const Account = require('../account.model');
const { DatabaseError, RecordNotFoundError } = require('../../shared/errors');

const getEntries = async (req, res) => {
  let entries = [];
  const accountId = req?.query?.accountId || '';
  const category = req?.query?.category || '';
  try {
    const account = await Account.findOne({ accountId });
    if (account[`${category}s`]) {
      entries = account[`${category}s`];
    }
  } catch (error) {
    const dbError = new DatabaseError(error.message);
    return res.status(400).send({ errorMessage: `Failed to update ${category} data`, error: dbError });
  }
  return res.status(200).send({ entries });
}

const addEntry = async (req, res) => {
  const accountId = req?.query?.accountId || '';
  const category = req?.query?.category || '';
  if (category === 'liability') {
    category = 'liabilitie';
  }
  const input = req.body?.from || req.body?.to || req.body?.name;
  const payload = { ...req.body, id: util.generateID(input) };

  try {
    let account = await Account.findOne({ accountId });
    if (account[`${category}s`]) {
      account[`${category}s`].push(payload);
    } else {
      account[`${category}s`] = [payload];
    }
    await Account.findOneAndReplace({ accountId }, account);
  } catch (error) {
    const errorMessage = `Failed to update ${category} data`;
    if (error instanceof RecordNotFoundError) {
      return res.status(400).send({ errorMessage, error });
    }
    const dbError = new DatabaseError(error.message);
    return res.status(400).send({ errorMessage, error: dbError });
  }
  if (category === 'liabilitie') {
    category = 'liability';
  }
  return res.status(200).send({ [`${category}Id`]: payload.id });
}

const updateEntry = async (req, res) => {
  const accountId = req?.query?.accountId || '';
  const category = req?.query?.category || '';
  if (category === 'liability') {
    category = 'liabilitie';
  }
  const id = req.params?.id;
  const payload = req.body;
  try {
    let account = await Account.findOne({ accountId });
    const entries = account[`${category}s`];
    if (!entries) {
      throw new RecordNotFoundError(`${category} record with id: ${accountId} not found`);
    }

    account[`${category}s`] = entries.map(entry => {
      if (entry?.id === id) {
        return { ...payload }
      }
      return entry;
    });
    await Account.findOneAndReplace({ accountId }, account);

  } catch (error) {
    const errorMessage = `Failed to update ${category} data`;
    if (error instanceof RecordNotFoundError) {
      return res.status(400).send({ errorMessage, error });
    }
    const dbError = new DatabaseError(error.message);
    return res.status(400).send({ errorMessage, error: dbError });
  }
  if (category === 'liabilitie') {
    category = 'liability';
  }
  return res.status(200).send({ [`${category}Id`]: id });
}

const deleteEntry = async (req, res) => {
  const accountId = req?.query?.accountId || '';
  const category = req?.query?.category || '';
  if (category === 'liability') {
    category = 'liabilitie';
  }
  const id = req?.params?.id;
  try {
    let account = await Account.findOne({ accountId });
    const filteredEntries = account[`${category}s`]?.filter(entry => entry.id !== id);
    if (!filteredEntries) {
      throw new RecordNotFoundError(`${category}s not found in account ${accountId}`);
    }

    account[`${category}s`] = filteredEntries;
    await Account.findOneAndReplace({ accountId }, account);
  } catch (error) {
    const dbError = new DatabaseError(error.message);
    return res.status(400).send({ errorMessage: 'Failed to delete income data', error: dbError });
  }
  if (category === 'liabilitie') {
    category = 'liability';
  }
  return res.status(200).send({ [`${category}Id`]: id });
}

module.exports = {
  getEntries,
  addEntry,
  updateEntry,
  deleteEntry
}