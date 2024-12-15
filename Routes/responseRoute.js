const express = require('express');
const router = express.Router();
const { submitResponse } = require('../Controller/SubmitResponseController');
const { getAllResponses } = require('../Controller/GetResponsesController');

router.post('/submit-response', submitResponse);
router.get('/responses/:formId', getAllResponses);

module.exports = router;