const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },

    password:{
        type: String,
        required: true
    },

    username:{
        type: String,
        required: true,
    },

    purchase_history:{
        type: Array,
        required: false,
    },

    shipping_address:{
        type: String,
        required: true,
    }

})

module.exports = mongoose.model('User', userSchema)
