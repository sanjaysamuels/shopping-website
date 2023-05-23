const CartItem = require('../models/CartItem')
const Cart = require('../models/Cart')
const Item = require('../models/Item')

const create = async (req, res, _) => {
  if(req.body.quantity <= 0) {
    res.status(400).json();
  }

  const cart = await Cart.findById(req.body.cartId);

  if (cart == null) {
    res.status(400).json();
  }

  const item = await Item.findById(req.body.itemId);

  if (item == null) {
    res.status(400).json();
  }

  let cartItem = new CartItem({
      itemId: req.body.itemId,
      cartId: req.body.cartId,
      quantity: req.body.quantity,
      amount: req.body.amount,
  })

  await cartItem.save().then(cartItem => {
    res.status(201).json({ id: cartItem._id})
  })
  .catch(err => {
    console.log(err);
    res.status(500)
  })
}

const update = async (req, res, _next) => {
    const cartItem = await CartItem.findById(req.params.id)

    if (cartItem == null) {
      res.status(404).json()
    }

    if (req.body.quantity != null){
        cartItem.quantity  = req.body.quantity
    }
    if (req.body.amount != null){
        cartItem.amount  = req.body.amount
    }
    try {
      const ca = await cartItem.save()
      res.status(200).json({
            id: ca._id, 
            itemId: ca.itemId,
            cartId: ca.cartId,
            quantity: ca.quantity,
            amount: ca.amount
          })
    } catch (err) {
      console.log(err)
      res.status(500)
    }
}

const index = async (req, res, _next) => {
    try {
        const cartItems = await CartItem.find(req.query)
        res.json(cartItems.map(ca => ({
            id: ca._id, 
            itemId: ca.itemId,
            cartId: ca.cartId,
            quantity: ca.quantity,
            amount: ca.amount,
          })));
    } catch (err) {
        console.log(err);
        res.status(500)
    }
}

const show = async (req, res, _next) => {
    let cartItem
    try {
        cartItem = await CartItem.findById(req.params.id)

        if (cartItem == null) {
          res.status(404).json()
        }
      else {
        res.status(200).json(cartItem)
      }
    } catch(err) {
        console.log(err)
        res.status(500)
    }
}

const destroy = async (req, res, _next) => {
    try {
      const result = await CartItem.deleteOne({ _id: req.params.id })
      if (result.deletedCount > 0) {
        res.status(204).json()
      } else {
        res.status(404).json()
      }
    } catch(err){
        console.log(err)
        res.status(500)
    }
}

const destroyByCartAndItemId = async (req, res, _next) => {
    try {
      const result = await CartItem.deleteMany({ 
        cartId: req.query.cartId,
        itemId: req.query.itemId
      })
      if (result.deletedCount > 0) {
        res.status(204).json()
      } else {
        res.status(404).json()
      }
    } catch(err){
        console.log(err)
        res.status(500)
    }
}

module.exports = {
    create, update, destroy, index, show, destroyByCartAndItemId
}
