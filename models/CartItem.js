const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema({
    itemId: {
        type: String,
        required: false
    },
    cartId: {
        type: String,
        required: false
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

module.exports = mongoose.model('CartItem', cartItemSchema)
