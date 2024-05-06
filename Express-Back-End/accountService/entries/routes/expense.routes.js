'use strict';

const express = require('express');
const router = express.Router();

const { getEntries, addEntry, updateEntry, deleteEntry } = require('../entries.controller');

router.get('/expense', getEntries);

router.post('/expense/add', addEntry);

router.put('/expense/update/:id', updateEntry);

router.delete('/expense/delete/:id', deleteEntry);

module.exports = router;