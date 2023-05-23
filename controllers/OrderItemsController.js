const OrderItem = require('../models/OrderItem')

const create = (req, res, _) => {

  if([req.body.price, req.body.quantity, req.body.amount]
    .some(x => x < 0)) {
    res.status(400).json();
  }

  let orderItem = new OrderItem({
      orderId: req.body.orderId,
      itemId: req.body.itemId,
      price: req.body.price,
      quantity: req.body.quantity,
      amount: req.body.amount,
  })

  orderItem.save().then(orderItem => {
    res.status(201).json({ id: orderItem._id})
  })
  .catch(err => {
    console.log(err);
    res.status(500)
  })
}

const update = async (req, res, _next) => {
    const orderItem = await OrderItem.findById(req.params.id)

    if (orderItem == null) {
      res.status(404).json()
    }

    if (req.body.orderId != null){
        orderItem.orderId = req.body.orderId
    }
    if (req.body.itemId != null){
        orderItem.itemId = req.body.itemId
    }
    if (req.body.price != null){
        orderItem.price  = req.body.price
    }
    if (req.body.quantity != null){
        orderItem.quantity  = req.body.quantity
    }
    if (req.body.amount != null){
        orderItem.amount  = req.body.amount
    }
    try {
      const updatedOrderItem = await orderItem.save()
      res.status(200).json(updatedOrderItem)
    } catch (err) {
      console.log(err)
      res.status(500)
    }
}

const index = async (req, res, _next) => {
    try {
        const orderItems = await OrderItem.find(req.query)
        res.json(orderItems)
    } catch (err) {
        console.log(err);
        res.status(500)
    }
}

const show = async (req, res, _next) => {
    let orderItem
    try {
        orderItem = await OrderItem.findById(req.params.id)

        if (orderItem == null) {
          res.status(404).json()
        }
      else {
        res.status(200).json(orderItem)
      }
    } catch(err) {
        console.log(err)
        res.status(500)
    }
}

const destroy = async (req, res, _next) => {
    try {
      const result = await OrderItem.deleteOne({ _id: req.params.id })
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
