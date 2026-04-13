const Users =  require('../models/user');

//get all users
const getUser = async(req, res)=>{
    try {
        const user = await Users.find();
        res.status(200).json({user})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}


// add users
const addUser = async(req, res)=>{
    try {
       const user = await Users.create(req.body)
       res.status(201).json({message:"user created", user})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}



module.exports = {getUser, addUser}