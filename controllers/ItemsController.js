const Item = require('../models/Item')

const create = (req, res, _) => {
  let item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      imageUrl: req.body.imageUrl
  })

  if(item.name == "" || item.price <= 0) {
    res.status(400).json();
  }

  item.save().then(item => {
    res.status(201).json({ id: item._id})
  })
  .catch(err => {
    console.log(err);
    res.status(500)
  })
}

const update = async (req, res, _next) => {
    console.log(req.params.id);
    const item = await Item.findById(req.params.id)

    if (item == null) {
      res.status(404).json()
    }

    if (req.body.name != null){
        item.name = req.body.name
    }
    if (req.body.description != null){
        item.description  = req.body.description
    }
    if (req.body.price != null){
        item.price  = req.body.price
    }
    if (req.body.imageUrl != null){
        item.imageUrl  = req.body.imageUrl
    }

    try {
      const updatedItem = await item.save();
      res.status(200).json(updatedItem)
    } catch (err) {
      console.log(err)
      res.status(500)
    }
}

const index = async (_req, res, _next) => {
    try {
      const items = await Item.find()
 
      res.json(items.map(x => ({
        id: x._id,
        name: x.name,
        description: x.description,
        price: x.price,
        imageUrl: x.imageUrl
      })));
    } catch (err) {
        console.log(err);
        res.status(500)
    }
}

const show = async (req, res, _next) => {
    let item
    try {
        item = await Item.findById(req.params.id)

        if (item == null) {
          res.status(404).json()
        }
      else {
        res.status(200).json({
          id: item._id,
          name: item.name,
          description: item.description,
          price: item.price,
          imageUrl: item.imageUrl
        })
      }
    } catch(err) {
        console.log(err)
        res.status(500)
    }
}

const destroy = async (req, res, _next) => {
    try {
      const result = await Item.deleteOne({ _id: req.params.id })
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
