const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    name:{
        type: String,
    },
    description:{
        type: String,
    },
    price:{
        type: Number,
    },
    imageUrl:{
        type: String,
    },
})

module.exports = mongoose.model('Item', itemSchema)
