require('dotenv').config()
const path = require('path');

const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL)

const db = mongoose.connection

db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to database'))

app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'frontend')));

const routes = {
  '/user': './routes/auth',
  '/items': './routes/items',
  '/carts': './routes/carts',
  '/cartItems': './routes/cartItems',
  '/orders': './routes/orders',
  '/orderItems': './routes/orderItems',
  '/comments': './routes/comments',
};

Object.keys(routes).forEach(function (key) {
  app.use(key, require(routes[key]))
})

app.listen(7266, () => console.log("This server has started"))
