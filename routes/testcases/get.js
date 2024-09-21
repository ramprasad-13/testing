const express = require('express');
const router = express.Router();
const getTestcase = require('../../controllers/testcases/get');

router.get('/get',getTestcase);

module.exports = router;