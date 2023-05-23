const express = require('express')
const router = express.Router()
const CartItemsController = require('../controllers/CartItemsController')

router.post("/", CartItemsController.create)
router.get('/', CartItemsController.index)
router.get('/:id', CartItemsController.show)
router.put('/:id', CartItemsController.update)
router.delete('/:id', CartItemsController.destroy)
router.delete('/', CartItemsController.destroyByCartAndItemId)

module.exports = router
