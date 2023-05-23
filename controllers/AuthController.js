const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async (req, res, next) => {
    
    //var { username, password } = req.body;
    const existUsername = await User.findOne({ username: req.body.username});
    const existEmail = await User.findOne({ email: req.body.email});
    if (existUsername) {
        res.json({
            message: "Username already taken, Please try a different username!"
        })
        return;
    } else if (existEmail){
        res.json({
            message: "Email already taken, Please try a different email!"
        })
        return;
    }
    bcrypt.hash(req.body.password, 10, function(err, hashedPass){
        if(err){
            res.json({
                error: err
            })
        }
        
        let user = new User({
            email: req.body.email,
            password: hashedPass,
            username: req.body.username,
            purchase_history: req.body.purchase_history,
            shipping_address: req.body.shipping_address
        })
        user.save()
        .then(user => {
            res.json({
              id: user._id,
              message: "User Created successfully!"
            })
        })
        .catch(error => {
            res.json({
                message: error
            })
        })
    })
}

const login = (req, res, next) => {
    //res.json({status: 'ok', data: 'coming soon now'})
    var username = req.body.username
    var password = req.body.password

    User.findOne({$or: [{username:username},{email:username}]})
    .then(user => {
        if(user){
            bcrypt.compare(password, user.password, function(err, result) {
                if(err){
                    res.json({
                        error: err
                    })
                }
                if(result){
                    let token = jwt.sign(
                        {
                            id: user._id,
                            name: user.username}, 
                            'verySecretValue')
                    res.json({
                        status: 'ok', data: token
                    })
                } else{
                    res.json({
                        status: 'nm', data: 'Password does not match'
                    })
                }
            })
        } else{
            res.json({
                status: 'nf', data: 'User not found!'
            })
        }
    })
}

const getAllUsers = async (req, res, next) => {
    try{
        const users = await User.find(req.query)
        res.send(users)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}


const getUserbyId = (req, res, next) => {
    res.json(res.user)
}


const updateUserbyId = async (req, res, next) => {
    if (req.body.username != null){
        res.user.username = req.body.username
    }

    if (req.body.purchase_history != null){
        res.user.purchase_history = req.body.purchase_history
    }

  try{
        const updatedUser = await res.user.save()
        res.json(updatedUser)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
}

const changePassword = async (req, res, next) => {
    const { token, newPassword: plainTextPassword, newAddress: plainTextAddress } = req.body
    if (plainTextPassword != ""){
        try{
            const verify = jwt.verify(token, 'verySecretValue')
            const _id = verify.id
            const hashedPassword = await bcrypt.hash(plainTextPassword, 10)
    
            await User.updateOne(
                {_id},
                {
                    $set: {password: hashedPassword}
                }
                
            )
            res.json({status: 'ok'})
            console.log(verify)
        } catch (error){
            res.json({status: 'error', error: error})
        }
    } 
}


const changeAddress = async(req, res, next) => {
    const { token, newAddress: plainTextAddress } = req.body
        
    if (plainTextAddress != ""){
        
        try{
            const verify = jwt.verify(token, 'verySecretValue')
            const _id = verify.id
            await User.updateOne(
                {_id},
                {
                    $set: {shipping_address: plainTextAddress}
                }
                
            )
            res.json({status: 'ok'})
            console.log(verify)
        } catch (error){
            res.json({status: 'error', error: error})
        }
        
    }
}

async function getSingleUser(req, res, next){
    let user
    try{
        user = await User.findById(req.params.id)

        if (user == null){
            return res.status(404).json({message: "User not found"})
        }
    }catch{
        res.status(500).json({message: "There was an error"})
    }
    res.user = user
    next()
}

const deleteSingleUserById = async (req, res, next) => {
    try{
        await res.user.remove()
        res.status(204).json({message: 'Deleted user successfully!'})
    }catch(err){
        res.status(500).json({message: err.message})
    }
}


const checkPurchase = async (req, res, next) => {
    const existInPurchaseHis = await User.findOne({username: req.body.username, purchase_history: req.body.purchase_history});
    if (existInPurchaseHis) {
        res.json({
            status: 'ok',
            data: "Product Found"
        }) 
        } else{
            res.json({
                status: 'error',
                data: "Product not found"
            })
        }
}


module.exports = {
    register, login, getAllUsers, getUserbyId, getSingleUser, updateUserbyId, deleteSingleUserById, changePassword, changeAddress, checkPurchase
}
