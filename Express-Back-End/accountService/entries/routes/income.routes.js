'use strict';

const express = require('express');
const router = express.Router();

const { getEntries, addEntry, updateEntry, deleteEntry } = require('../entries.controller');

router.get('/income', getEntries);

router.post('/income/add', addEntry);

router.put('/income/update/:id', updateEntry);

router.delete('/income/delete/:id', deleteEntry);

module.exports = router;