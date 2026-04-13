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

// get single user
const getSingleUser = async(req, res)=>{
    try {
        const user = await Users.findById(req.params.id);

        if (!user) {
            return res.status(404).json({message:"user not found"})
        }

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

// update user
const updateUser = async(req, res)=>{
    try {
        const user = await Users.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).json({message:"user not found"})
        }

        res.status(200).json({message:"user updated", user})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// delete user
const deleteUser = async(req, res)=>{
    try {
        const user = await Users.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({message:"user not found"})
        }

        res.status(200).json({message:"user deleted", user})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}



module.exports = {getUser, getSingleUser, addUser, updateUser, deleteUser}
