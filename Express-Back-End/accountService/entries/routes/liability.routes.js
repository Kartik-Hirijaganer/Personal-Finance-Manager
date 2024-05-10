'use strict';

const express = require('express');
const router = express.Router();

const { getEntries, addEntry, updateEntry, deleteEntry } = require('../entries.controller');

router.get('/', getEntries);

router.post('/add', addEntry);

router.put('/update/:id', updateEntry);

router.delete('/delete/:id', deleteEntry);

module.exports = router;