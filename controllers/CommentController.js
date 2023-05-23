const Comment = require('../models/Comment')


const getAllComments = async (req, res, next) => {
    try{
        const comments = await Comment.find()
        res.send(comments)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

const getCommentsForCurrentProduct = async (req, res, next) => {

    var productId = req.body.product
    try{
        const comments = await Comment.find({product: productId})
        res.json({
            status: 'ok',
            data: comments
        }) 
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

// Creating One Comment
const create = (req, res, _) => {
    const comment = new Comment({
        product: req.body.product,
        user: req.body.user,
        rating: req.body.rating,
        image: req.body.image,
        text: req.body.text,
        title: req.body.title
    })

    try {
        let alreadyComment = Comment.findOne({ product: comment.product, user: comment.user }, (err, result) => {
            comment.save().then(comment => {
                //res.status(201).json({ id: comment._id })
                res.json({
                    status: 'ok',
                    data: "passed",
                    id: comment.id
                })
            }).catch(err => {
                console.log(err)
                res.status(500)
            })
        })
    } catch (err) {
        console.log(err)
        res.status(500)
    }
}

// Search the Comment
const search = async (req, res, _next) => {
    let comment
    try {
        comment = await Comment.findOne(req.params.id)

        if (comment == null) {
            res.status(404).json()
        }
        else {
            res.status(200).json(comment)
        }
    } catch (err) {
        console.log(err)
        res.status(500)
    }
}

// Updating One Comment
const update = async (req, res, _next) => {
    const comment = await Comment.findById(req.params.id)

    if (comment == null) {
        res.json({
            status: 'error',
            data: "Comment ID not found"
        })
        return;
    }

    if (req.body.product != null) {
        comment.product = req.body.product
    }
    if (req.body.user != null) {
        comment.user = req.body.user
    }
    if (req.body.rating != null) {
        comment.rating = req.body.rating
    }
    if (req.body.text != null) {
        comment.text = req.body.text
    }
  
    try {
        const updatedComment = await comment.save()
        res.status(204).json(updatedComment)
    } catch (err) {
        console.log(err)
        res.status(500)
    }
}

// Get All Comments
const index = async (_req, res, _next) => {
    try {
        const comments = await Comment.find()
        res.json(comments)
    } catch (err) {
        console.log(err)
        res.status(500)
    }
}

// Get One Comment
const show = async (req, res, _next) => {
    let comment
    try {
        comment = await Comment.findById(req.params.id)

        if (comment == null) {
            res.json({
                message: "Comment not found!"
            })
        }
        else {
            res.status(200).json(comment)
        }
    } catch (err) {
        console.log(err)
        res.status(500)
    }
}

// Delete One Comment
const destroy = async (req, res, _next) => {
    try {
        const result = await Comment.deleteOne({ _id: req.params.id })
        if (result.deletedCount > 0) {
            res.status(204).json()
        } else {
            res.status(404).json()
        }
    } catch (err) {
        console.log(err)
        res.status(500)
    }
}

module.exports = {
    create, update, destroy, index, show, getAllComments, getCommentsForCurrentProduct
}
