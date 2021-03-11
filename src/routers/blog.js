const express = require('express');
const controller = require('../controllers/BlogController');
const router = express.Router();

router.get('/', controller.index);
router.get('/:blogId/items', controller.blog);
router.get('/:blogId/post/:postId/edit', controller.post);
router.get('/:blogId/page/:pageId/edit', controller.page);

module.exports = router;