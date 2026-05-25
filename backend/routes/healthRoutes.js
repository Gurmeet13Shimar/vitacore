
const express = require('express');
const {
  getHealthLogs,
  addHealthLog,
} = require('../controllers/healthController');

const router = express.Router();

/* TEMPORARILY REMOVED AUTH */

router.route('/')
  .get(getHealthLogs)
  .post(addHealthLog);

module.exports = router;