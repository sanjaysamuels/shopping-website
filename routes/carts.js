const express = require('express')
const router = express.Router()
const CartsController = require('../controllers/CartsController')

router.post("/", CartsController.create)
router.get('/:id', CartsController.show)
router.delete('/:id', CartsController.destroy)

module.exports = router
