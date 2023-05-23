const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/AuthController')
const CartsController = require('../controllers/CartsController')

// Register a new user
router.post('/register', AuthController.register)

// Login an existing user
router.post('/login', AuthController.login)

// Change user password
router.post('/change-password', AuthController.changePassword)

// Change user address
router.post('/change-address', AuthController.changeAddress)

// Check purchase history
router.post('/check-purchase', AuthController.checkPurchase)

// Get all users
router.get('/', AuthController.getAllUsers)

// Get single user by id
router.get('/:id', AuthController.getSingleUser, AuthController.getUserbyId)

// Update user by id
router.patch('/:id', AuthController.getSingleUser, AuthController.updateUserbyId)

// Delete user by id
router.delete('/:id', AuthController.getSingleUser, AuthController.deleteSingleUserById)

// Show user cart
router.get('/:id/cart', CartsController.showUserCart)

// Delete user cart
router.delete('/:id/cart', CartsController.destroyUserCart)

module.exports = router
