const Order = require('../models/Order')
const User = require('../models/User')

const create = async (req, res, _) => {
  const user = await User.findById(req.body.userId);

  if (user == null) {
    res.status(400).json();
  }
  
  if([req.body.subTotal, req.body.taxes, req.body.totalAmount]
    .some(x => x < 0)) {
    res.status(400).json();
  }

  let order = new Order({
      userId: req.body.userId,
      subTotal: req.body.subTotal,
      taxes: req.body.taxes,
      totalAmount: req.body.totalAmount,
  })

  await order.save().then(order => {
    res.status(201).json({ id: order._id})
  })
  .catch(err => {
    console.log(err);
    res.status(500)
  })
}

const update = async (req, res, _next) => {
    const order = await Order.findById(req.params.id)

    if (order == null) {
      res.status(404).json()
    }

    if (req.body.userId != null){
        order.userId = req.body.userId
    }
    if (req.body.subTotal != null){
        order.subTotal  = req.body.subTotal
    }
    if (req.body.taxes != null){
        order.taxes  = req.body.taxes
    }

    if (req.body.totalAmount != null){
        order.totalAmount  = req.body.totalAmount
    }
    try {
      const updatedOrder = await order.save()
      res.status(204).json(updatedOrder)
    } catch (err) {
      console.log(err)
      res.status(500)
    }
}

const index = async (req, res, _next) => {
    try {
        const orders = await Order.find(req.query)
        res.json(orders)
    } catch (err) {
        console.log(err);
        res.status(500)
    }
}

const show = async (req, res, _next) => {
    let order
    try {
        order = await Order.findById(req.params.id)

        if (order == null) {
          res.status(404).json()
        }
      else {
        res.status(200).json({
          id: order._id,
          userId: order.userId,
          subTotal: order.subTotal,
          taxes: order.taxes,
          totalAmount: order.totalAmount,
        })
      }
    } catch(err) {
        console.log(err)
        res.status(500)
    }
}

const destroy = async (req, res, _next) => {
    try {
      const result = await Order.deleteOne({ _id: req.params.id })
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
    create, update, destroy, index, show
}
