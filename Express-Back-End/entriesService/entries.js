'use strict';

const { generateID, generateResponse, logger, connectDB } = require('./entriesService');
const Account = require('./models/account.model');
const { DatabaseError, RecordNotFoundError } = require('./error');

connectDB();

exports.handler = async(event) => {
  logger.log({ level: 'info', message: 'Input event', event: JSON.stringify(event) });
  const { accountId , category } = event.queryStringParameters;
  const payload = { accountId, category, body: event.body, headers: event.headers };
  if (event.pathParameters) {
    payload.id = event.pathParameters?.id;
  }
  switch(method) {
    case 'get_entries':
      return getEntries(payload);
    case 'add_entry':
      return addEntry(payload);
    case 'update_entry':
      return updateEntry(payload);
    case 'delete_entry':
      return deleteEntry(payload);
    default:
      return generateResponse(200, 'Enter valid method', { method });
  }
};

const getEntries = async (payload) => {
  let entries = [];
  try {
    const account = await Account.findOne({ accountId: payload.accountId });
    if (account[`${payload.category}s`]) {
      entries = account[`${payload.category}s`];
    }
  } catch (error) {
    const dbError = new DatabaseError(error.message);
    logger.log({ level: 'error', message: 'DatabaseError', error: JSON.stringify(dbError) });
    return generateResponse(400, `Failed to update ${category} data`, { error: dbError });
  }
  return generateResponse(200, 'Successfully fetched entries', { entries });
}

const addEntry = async (payload) => {
  const accountId = payload?.accountId || '';
  let category = payload?.category || '';
  if (category === 'liability') {
    category = 'liabilitie';
  }
  const input = payload?.body?.from || payload?.body?.to || payload?.body?.name;
  const entryData = { ...payload.body, id: generateID(input) };

  try {
    let account = await Account.findOne({ accountId });
    if (account[`${category}s`]) {
      account[`${category}s`].push(entryData);
    } else {
      account[`${category}s`] = [entryData];
    }
    await Account.findOneAndReplace({ accountId }, account);
  } catch (error) {
    const errorMessage = `Failed to update ${category} data`;
    if (error instanceof RecordNotFoundError) {
      logger.log({ level: 'error', message: errorMessage, error: JSON.stringify(error) });
      return generateResponse(400, errorMessage, { errorMessage, error });
    }
    const dbError = new DatabaseError(error.message);
    logger.log({ level: 'error', message: 'DatabaseError', error: JSON.stringify(dbError) });
    return generateResponse(400, 'DatabaseError', { error: dbError });
  }
  if (category === 'liabilitie') {
    category = 'liability';
  }
  return generateResponse(200, 'Successfully added entry', { [`${category}Id`]: entryData.id });
}

const updateEntry = async (payload) => {
  const accountId = payload?.accountId || '';
  const category = payload?.category || '';
  if (category === 'liability') {
    category = 'liabilitie';
  }
  const id = payload?.id;
  const updatedEntry = req.body;
  try {
    let account = await Account.findOne({ accountId });
    const entries = account[`${category}s`];
    if (!entries) {
      throw new RecordNotFoundError(`${category} record with id: ${accountId} not found`);
    }

    account[`${category}s`] = entries.map(entry => {
      if (entry?.id === id) {
        return { ...updatedEntry }
      }
      return entry;
    });
    await Account.findOneAndReplace({ accountId }, account);

  } catch (error) {
    const errorMessage = `Failed to update ${category} data`;
    if (error instanceof RecordNotFoundError) {
      logger.log({ level: 'error', message: errorMessage, error: JSON.stringify(error) });
      return generateResponse(400, 'RecordNotFoundError', { errorMessage, error });
    }
    const dbError = new DatabaseError(error.message);
    logger.log({ level: 'error', message: errorMessage, error: JSON.stringify(dbError) });
    return generateResponse(400, 'DatabaseError', { errorMessage, error: dbError });
  }
  if (category === 'liabilitie') {
    category = 'liability';
  }
  return generateResponse(200, 'Successfully updated entry', { [`${category}Id`]: id });
}

const deleteEntry = async (payload) => {
  const accountId = payload?.accountId || '';
  let category = payload?.category || '';
  if (category === 'liability') {
    category = 'liabilitie';
  }
  const id = payload?.id;
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
    logger.log({ level: 'error', message: 'Failed to delete income data', error: JSON.stringify(dbError) });
    return generateResponse(400, 'DatabaseError', { errorMessage: 'Failed to delete income data' , error: dbError });
  }
  if (category === 'liabilitie') {
    category = 'liability';
  }
  return generateResponse(200, 'Successfully deleted entry', { [`${category}Id`]: id });
}

module.exports = {
  getEntries,
  addEntry,
  updateEntry,
  deleteEntry
}