const express = require('express')
const router = express.Router()
const OrdersController = require('../controllers/OrdersController')

router.post("/", OrdersController.create)
router.get('/', OrdersController.index)
router.get('/:id', OrdersController.show)
router.put('/:id', OrdersController.update)
router.delete('/:id', OrdersController.destroy)

module.exports = router
