const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },

    subTotal: {
        type: Number,
        required: true
    },

    taxes: {
        type: Number,
        required: true
    },

    totalAmount: {
        type: Number,
        required: true
    },
})

module.exports = mongoose.model('Order', orderSchema)
