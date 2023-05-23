const express = require('express')
const router = express.Router()
const ItemsController = require('../controllers/ItemsController')

router.post("/", ItemsController.create)
router.get('/', ItemsController.index)
router.get('/:id', ItemsController.show)
router.put('/:id', ItemsController.update)
router.delete('/:id', ItemsController.destroy)

module.exports = router
