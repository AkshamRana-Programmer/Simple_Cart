const Products = require('../models/product');

// get all products
const getProducts = async(req, res)=>{
    try {
        const products = await Products.find();
        res.status(200).json({products})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// get single product
const getSingleProduct = async(req, res)=>{
    try {
        const product = await Products.findById(req.params.id);

        if (!product) {
            return res.status(404).json({message:"product not found"})
        }

        res.status(200).json({product})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// add product
const addProduct = async(req, res)=>{
    try {
        const product = await Products.create(req.body)
        res.status(201).json({message:"product created", product})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// update product
const updateProduct = async(req, res)=>{
    try {
        const product = await Products.findByIdAndUpdate(req.params.id, req.body, {
            returnDocument: 'after',
            runValidators: true
        });

        if (!product) {
            return res.status(404).json({message:"product not found"})
        }

        res.status(200).json({message:"product updated", product})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// delete product
const deleteProduct = async(req, res)=>{
    try {
        const product = await Products.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({message:"product not found"})
        }

        res.status(200).json({message:"product deleted", product})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

module.exports = {getProducts, getSingleProduct, addProduct, updateProduct, deleteProduct}
