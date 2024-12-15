const express = require('express');
const router = express.Router();
const { createForm } = require('../Controller/CreateFormController');
const { getFormByLink, getFormList } = require('../Controller/GetFormController');

router.post('/create', createForm);
router.get('/list', getFormList);
router.get('/fill/:link', getFormByLink);

module.exports = router;