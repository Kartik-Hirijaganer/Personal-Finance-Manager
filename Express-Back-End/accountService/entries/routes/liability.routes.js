'use strict';

const express = require('express');
const router = express.Router();

const { getEntries, addEntry, updateEntry, deleteEntry } = require('../entries.controller');

router.get('/liability', getEntries);

router.post('/liability/add', addEntry);

router.put('/liability/update/:id', updateEntry);

router.delete('/liability/delete/:id', deleteEntry);

module.exports = router;