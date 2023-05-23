const express = require('express')
const router = express.Router()
const OrderItemsController = require('../controllers/OrderItemsController')

router.post("/", OrderItemsController.create)
router.get('/', OrderItemsController.index)
router.get('/:id', OrderItemsController.show)
router.put('/:id', OrderItemsController.update)
router.delete('/:id', OrderItemsController.destroy)

module.exports = router
