const express = require('express');
const controller = require('../controllers/PagesController');
const { processAuth } = require('../middlewares/oauthClient');
const router = express.Router();

router.get('/', processAuth ,controller.index);
router.get('/authCallback', controller.authCallback);

module.exports = router;