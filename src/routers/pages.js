const express = require('express');
const controller = require('../controllers/PagesController');
const router = express.Router();

router.get('/', controller.index);
router.get('/authCallback', controller.authCallback);

module.exports = router;