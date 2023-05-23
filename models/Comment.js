const mongoose = require('mongoose')

const commentsSchema = new mongoose.Schema({
    product: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    text: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Comment', commentsSchema)
