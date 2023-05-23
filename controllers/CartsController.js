const Cart = require('../models/Cart')
const User = require('../models/User')

const create = async (req, res, _) => {
  const user = await User.findById(req.body.userId);

  if (user == null) {
    res.status(400).json();
  }

  let cart = new Cart({
      userId: req.body.userId,
  })

  await cart.save().then(cart => {
    res.status(201).json({ id: cart._id})
  })
  .catch(err => {
    console.log(err);
    res.status(500)
  })
}

const show = async (req, res, _next) => {
    let cart
    try {
        cart = await Cart.findById(req.params.id)

        if (cart == null) {
          res.status(404).json()
        }
      else {
        res.status(200).json(cart)
      }
    } catch(err) {
        console.log(err)
        res.status(500)
    }
}

const showUserCart = async (req, res, _next) => {
    try {
      const user = await User.findById(req.params.id);

      if (user == null) {
        res.status(404).json();
      }

      const filter = { userId: req.params.id };
      const dataToInsert = { userId: req.params.id };

      const cart = await Cart.findOneAndUpdate(
        filter,
        dataToInsert,
        { new: true, upsert: true });

      res.status(200).json({ id: cart.id, userId: cart.userId })
    } catch(err) {
        console.log(err)
        res.status(500)
    }
}

const destroy = async (req, res, _next) => {
    try {
      const result = await Cart.deleteOne({ _id: req.params.id })
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

const destroyUserCart = async (req, res, _next) => {
    try {
      const result = await Cart.deleteOne({ userId: req.params.id })

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
    create, destroy, show, showUserCart, destroyUserCart
}
