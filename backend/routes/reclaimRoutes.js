const express = require('express');
const { receiveEHR } = require('../controllers/reclaimController');
const router = express.Router();

router.get('/receive-ehr/:id', receiveEHR);

module.exports = router;
