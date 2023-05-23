const express = require('express')
const router = express.Router()
const CommentsController = require('../controllers/CommentController')


router.post("/get", CommentsController.getAllComments)
router.post("/create-comment", CommentsController.create)
router.post("/get-product-cmt", CommentsController.getCommentsForCurrentProduct)
router.get('/', CommentsController.index)
router.get('/:id', CommentsController.show)
router.put('/:id', CommentsController.update)
router.delete('/:id', CommentsController.destroy)

module.exports = router
