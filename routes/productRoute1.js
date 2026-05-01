const express = require('express');
const router = express.Router();
const { getProducts, getSingleProduct, addProduct, updateProduct, deleteProduct} = require('../controllers/productController');


router.get('/all', getProducts);
router.get('/:id',getSingleProduct);
router.get('/add',addProduct);
router.get('/:id', updateProduct);
router.get('/:id', deleteProduct);

module.exports = router;