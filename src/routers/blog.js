const express = require('express');
const controller = require('../controllers/BlogController');
const router = express.Router();

router.get('/', controller.index);
router.get('/:blogId/items', controller.blog);
router.get('/:blogId/post/:postId/edit', controller.post);
router.get('/:blogId/post/create', controller.getCreateApp);
router.get('/:blogId/post/appLeechCH', controller.leechCH);
router.post('/:blogId/post/create/execute', controller.postCreateApp);
router.delete('/:blogId/items/delete', controller.removePost);

module.exports = router;