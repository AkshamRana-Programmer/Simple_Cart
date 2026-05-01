const Products = require('../models/product1')

// get all products
const allproducts = async(req, res)=>{
    try {
        const prod = await Products.find();
        res.status(200).json({prod})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// get single produt
const getSingleProduct = async(req, res)=>{
    try{
        const prod = await Products.findById(req.param.id);
        if(!prod){
            res.status(404).json({message:'product not found'})
        }

        res.status(201).json({prod})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

const addProduct = async(req, res)=>{
    try {
        const prod = await Products.create(req.body);
        res.status(201).json({message:'product created',prod})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// update product
const updateProduct = async(req, res)=>{
    try{
        const prod = await Products.findByIdAndUpdate(req.params.id, req.body, {
            returnDocument:"after",
            runValidators:true
        })
    }catch(error){
        res.status(500).json({message:error.message})
    }
}

//delete product
const deleteProduct = async(req, res)=>{
    try{
        const prod = await Products.findByIdAndDelete(req.params.id);
        if(!prod){
            res.status(401).json({message:'product not found'})
        }
        res.status(200).json({message:'product deleted',prod})
    }catch(error){
        res.status(500).json({message:error.message})
    }
}

module.exports = {allproducts, getSingleProduct, addProduct, updateProduct, deleteProduct}