const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    itemId: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
})

module.exports = mongoose.model('OrderItem', orderItemSchema)
